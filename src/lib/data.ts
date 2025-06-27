
// src/lib/data.ts
'use server';

import { StudentRegistrationFormValues } from '@/app/dashboard/students/student-form';
import prisma from './prisma';
import bcrypt from 'bcrypt';
import { differenceInDays } from 'date-fns';

export async function getDashboardStats(schoolId: string) {
  if (!schoolId) {
    return {
      totalStudents: 0,
      totalTeachers: 0,
      attendanceRate: 0,
      coursesOffered: 0,
    };
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalStudentsPromise = prisma.student.count({
    where: { schoolId },
  });

  const totalTeachersPromise = prisma.staff.count({
    where: { schoolId, staffType: 'TEACHER' },
  });

  const attendanceRecordsTodayPromise = prisma.attendance.findMany({
    where: {
      student: { schoolId },
      date: { gte: today },
    },
    select: { status: true }
  });

  const coursesOfferedPromise = prisma.course.count({
      where: { schoolId }
  });

  const [totalStudents, totalTeachers, attendanceRecordsToday, coursesOffered] = await Promise.all([
      totalStudentsPromise,
      totalTeachersPromise,
      attendanceRecordsTodayPromise,
      coursesOfferedPromise
  ]);

  const presentCount = attendanceRecordsToday.filter(
    (a) => a.status === 'PRESENT'
  ).length;
  
  const attendanceRate =
    attendanceRecordsToday.length > 0
      ? (presentCount / attendanceRecordsToday.length) * 100
      : 100;

  return {
    totalStudents,
    totalTeachers,
    attendanceRate,
    coursesOffered,
  };
}

export async function getFirstSchool() {
    return await prisma.school.findFirst({
        orderBy: {
            name: 'asc'
        }
    });
}

export async function getGrades(schoolId: string) {
    return prisma.grade.findMany({
        where: { schoolId },
        orderBy: { name: 'asc' }
    });
}

export async function getSections(schoolId: string) {
    return prisma.section.findMany({
        where: { schoolId },
        orderBy: { name: 'asc' }
    });
}

export async function getStudentsWithDetails(schoolId: string) {
  if (!schoolId) return [];

  return prisma.student.findMany({
    where: { schoolId },
    include: {
      user: true,
      grade: true,
      section: true,
      parents: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      user: {
        firstName: 'asc',
      },
    },
  });
}

export type DetailedStudent = Awaited<ReturnType<typeof getStudentsWithDetails>>[0];

export async function createStudentWithParent(data: StudentRegistrationFormValues, schoolId: string) {
  const hashedPassword = await bcrypt.hash('password123', 10); // Default password

  return prisma.$transaction(async (tx) => {
    // 1. Create Parent User and Profile
    const parentUser = await tx.user.create({
      data: {
        phone: data.parentPhone,
        password: hashedPassword,
        role: 'PARENT',
        schoolId: schoolId,
        firstName: data.parentFirstName,
        lastName: data.parentLastName,
        addressLine1: data.addressLine1,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        // photoUrl would be handled after file upload
      }
    });

    const parent = await tx.parent.create({
      data: {
        userId: parentUser.id,
        schoolId: schoolId,
        firstName: data.parentFirstName,
        lastName: data.parentLastName,
        relationToStudent: data.parentRelation,
      }
    });

    // 2. Create Student User and Profile
    // Using a temporary unique phone number for the student user
    const studentPhone = `${data.parentPhone}-S${Date.now()}`;
    const studentUser = await tx.user.create({
        data: {
            phone: studentPhone,
            password: hashedPassword,
            role: 'STUDENT',
            schoolId: schoolId,
            firstName: data.studentFirstName,
            lastName: data.studentLastName,
            addressLine1: data.addressLine1,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
        }
    });

    const student = await tx.student.create({
        data: {
            userId: studentUser.id,
            schoolId: schoolId,
            gradeId: data.grade,
            sectionId: data.section,
            firstName: data.studentFirstName,
            lastName: data.studentLastName,
            dob: data.studentDob,
            gender: data.studentGender,
            parents: {
                connect: { id: parent.id }
            }
        }
    });
    
    return { student, parent };
  });
}


// --- Academics Data ---

export async function getFirstStudent(schoolId: string) {
    return prisma.student.findFirst({
        where: { schoolId },
        include: { user: true },
        orderBy: { user: { firstName: 'asc' } }
    });
}

export async function getAcademicYears(schoolId: string) {
    return prisma.academicYear.findMany({
        where: { schoolId },
        orderBy: { name: 'desc' }
    });
}

export async function getCurrentAcademicYear(schoolId: string) {
    return prisma.academicYear.findFirst({
        where: { schoolId, isCurrent: true }
    });
}

export async function getGradesForStudent(studentId: string, academicYearId: string) {
    const enrollments = await prisma.enrollment.findMany({
        where: {
            studentId,
            academicYearId,
        },
        include: {
            course: {
                include: {
                    teacher: {
                        include: {
                            user: true
                        }
                    }
                }
            },
            results: {
                orderBy: {
                    createdAt: 'desc'
                },
                take: 1 // Get the latest result for the course
            }
        }
    });

    return enrollments.map(e => ({
        course: e.course.name,
        grade: e.results[0]?.grade || 'N/A',
        teacher: `${e.course.teacher.firstName} ${e.course.teacher.lastName}`
    }));
}

export async function getScoresForStudent(studentId: string, academicYearId: string) {
    const submissions = await prisma.testSubmission.findMany({
        where: {
            studentId,
            test: {
                endTime: {
                    // This is a simplification; ideally we'd link tests to academic years
                    // For now, let's assume tests within a certain time frame
                }
            }
        },
        include: {
            test: true
        },
        orderBy: {
          submittedAt: 'desc'
        }
    });
    
    return submissions.map((s, index) => ({
        exam: s.test.name,
        subject: s.test.subject,
        score: `${s.score} / ${s.test.totalMarks}`,
        rank: `#${index + 1}` // Placeholder rank
    }));
}

// --- Attendance Data ---
export async function getFirstTeacher(schoolId: string) {
    return prisma.staff.findFirst({
        where: { schoolId, staffType: 'TEACHER' },
        include: { user: true }
    });
}

export async function getStudentsForAttendance(gradeId: string, sectionId: string) {
  if (!gradeId || !sectionId) return [];
  return prisma.student.findMany({
    where: { gradeId, sectionId },
    select: { id: true, user: { select: { firstName: true, lastName: true } } },
    orderBy: { user: { firstName: 'asc' } },
  });
}

export async function getAttendanceForDate(gradeId: string, sectionId: string, date: Date) {
  if (!gradeId || !sectionId) return [];

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return prisma.attendance.findMany({
    where: {
      student: { gradeId, sectionId },
      date: { gte: startOfDay, lte: endOfDay },
    },
    select: { studentId: true, status: true, notes: true },
  });
}

export async function upsertAttendance(
  attendanceData: {
    studentId: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
    notes: string;
  }[],
  date: Date,
  markedById: string
) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  return prisma.$transaction(async (tx) => {
    for (const record of attendanceData) {
      await tx.attendance.upsert({
        where: {
          studentId_date: {
            studentId: record.studentId,
            date: startOfDay,
          },
        },
        update: {
          status: record.status,
          notes: record.notes,
          markedById: markedById,
        },
        create: {
          studentId: record.studentId,
          date: startOfDay,
          status: record.status,
          notes: record.notes,
          markedById: markedById,
        },
      });
    }
  });
}

export async function getAttendanceSummary(gradeId: string, sectionId: string, month: number, year: number) {
    if (!gradeId || !sectionId) return [];

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const students = await prisma.student.findMany({
        where: { gradeId, sectionId },
        select: { id: true, user: { select: { firstName: true, lastName: true } } },
        orderBy: { user: { firstName: 'asc' } },
    });

    const attendanceRecords = await prisma.attendance.findMany({
        where: {
            student: { gradeId, sectionId },
            date: { gte: startDate, lte: endDate },
        },
        select: { studentId: true, status: true },
    });

    const summary = students.map(student => {
        const studentRecords = attendanceRecords.filter(r => r.studentId === student.id);
        return {
            id: student.id,
            name: `${student.user.firstName} ${student.user.lastName}`,
            present: studentRecords.filter(r => r.status === 'PRESENT').length,
            absent: studentRecords.filter(r => r.status === 'ABSENT').length,
            late: studentRecords.filter(r => r.status === 'LATE').length,
            excused: studentRecords.filter(r => r.status === 'EXCUSED').length,
        };
    });

    return summary;
}

// --- Communication Data ---
export async function getStudentsForCommunication(schoolId: string) {
  return prisma.student.findMany({
    where: { schoolId },
    select: {
      id: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      grade: {
        select: { name: true },
      },
      section: {
        select: { name: true },
      },
      parents: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
        },
        take: 1, // Assume one parent for simplicity
      },
    },
    orderBy: { user: { firstName: 'asc' } },
  });
}

export type StudentsForCommunication = Awaited<ReturnType<typeof getStudentsForCommunication>>;

export async function createCommunication(
  schoolId: string,
  senderId: string,
  receiverId: string,
  studentId: string,
  subject: string,
  message: string
) {
  return prisma.communication.create({
    data: {
      schoolId,
      senderId,
      receiverId,
      studentId,
      subject,
      message,
    },
  });
}

export async function getCommunicationHistory(senderId: string) {
  return prisma.communication.findMany({
    where: { senderId },
    select: {
      id: true,
      sentAt: true,
      subject: true,
      student: {
        select: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      sender: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      sentAt: 'desc',
    },
  });
}

export type CommunicationHistoryData = Awaited<ReturnType<typeof getCommunicationHistory>>;


// --- Fees Data ---

export async function getFeeStructures(schoolId: string) {
    if (!schoolId) return [];
    return prisma.feeStructure.findMany({
        where: { schoolId },
        include: { penaltyRule: true },
        orderBy: { name: 'asc' },
    });
}

export async function getPenaltyRules(schoolId: string) {
    if (!schoolId) return [];
    return prisma.penaltyRule.findMany({
        where: { schoolId },
        include: { tiers: true },
        orderBy: { name: 'asc' },
    });
}

export async function getConcessions(schoolId: string) {
    if (!schoolId) return [];
    return prisma.concession.findMany({
        where: { schoolId },
        include: { feeStructures: true },
        orderBy: { name: 'asc' },
    });
}

export async function getConcessionAssignments(schoolId: string, academicYearId: string) {
    if (!schoolId || !academicYearId) return [];
    return prisma.concessionAssignment.findMany({
        where: { student: { schoolId }, academicYearId },
        include: { student: { include: { user: true } }, concession: true },
    });
}

export async function getInvoicesForStudent(studentId: string) {
    const invoices = await prisma.feeInvoice.findMany({
        where: { studentId },
        include: {
            feeStructure: {
                include: {
                    penaltyRule: {
                        include: {
                            tiers: true,
                        },
                    },
                },
            },
            concessionAssignments: {
                include: {
                    concession: true,
                },
            },
        },
        orderBy: { dueDate: 'asc' },
    });
    
    // This is a simplified calculation for demonstration
    return invoices.map(invoice => {
        let lateFee = 0;
        const daysOverdue = differenceInDays(new Date(), invoice.dueDate);

        if (invoice.status === 'OVERDUE' && invoice.feeStructure.penaltyRule && daysOverdue > invoice.feeStructure.penaltyRule.gracePeriod) {
            lateFee = 20; // Simplified late fee
        }

        const concession = invoice.concessionAssignments[0]?.concession;
        let concessionAmount = 0;
        if (concession) {
            concessionAmount = concession.type === 'FIXED' ? concession.value : (invoice.amount * concession.value) / 100;
        }

        return {
            ...invoice,
            lateFee,
            concession: concession ? { name: concession.name, amount: concessionAmount } : null,
            lateFeeDetails: lateFee > 0 ? 'Standard late fee applied.' : null,
        }
    });
}

export async function getPaymentHistory(studentId: string) {
    return prisma.feePayment.findMany({
        where: {
            invoice: {
                studentId: studentId,
            }
        },
        include: {
            invoice: {
                include: {
                    feeStructure: true,
                },
            },
        },
        orderBy: {
            paymentDate: 'desc',
        },
    });
}

// --- Results Data ---
export async function getExamsForYear(schoolId: string, academicYearId: string) {
    return prisma.exam.findMany({
        where: { schoolId, academicYearId },
        orderBy: { name: 'asc' },
    });
}

export async function getExamsWithPendingApprovals(schoolId: string, academicYearId: string) {
    return prisma.exam.findMany({
        where: {
            schoolId,
            academicYearId,
            results: {
                some: {
                    status: { in: ['PENDING_APPROVAL', 'PENDING_REAPPROVAL'] }
                }
            }
        },
    });
}

// --- Tests Data ---
export async function createTestWithQuestions(data: any, schoolId: string, teacherId: string) {
    const { questions, ...testData } = data;
    return prisma.test.create({
        data: {
            ...testData,
            schoolId,
            teacherId,
            duration: parseInt(testData.duration),
            totalMarks: questions.reduce((acc: number, q: any) => acc + (q.points || 0), 0),
            questions: {
                create: questions.map((q: any) => ({
                    ...q,
                    points: parseInt(q.points) || 1
                }))
            }
        }
    });
}

export async function getTests(schoolId: string) {
    return prisma.test.findMany({
        where: { schoolId },
        orderBy: { startTime: 'desc' }
    });
}

export async function getTestWithSubmissions(testId: string) {
    return prisma.test.findUnique({
        where: { id: testId },
        include: {
            questions: true,
            submissions: {
                include: {
                    student: {
                        include: {
                            user: true
                        }
                    },
                    answers: true,
                },
                orderBy: {
                    submittedAt: 'desc'
                }
            }
        }
    });
}
export type TestWithSubmissions = Awaited<ReturnType<typeof getTestWithSubmissions>>;

export async function updateTestStatus(testId: string, status: "UPCOMING" | "ACTIVE" | "COMPLETED") {
    return prisma.test.update({
        where: { id: testId },
        data: { status }
    });
}

export async function deleteTest(testId: string) {
    // This will cascade delete questions and submissions due to the schema
    return prisma.test.delete({
        where: { id: testId }
    });
}

export async function approveTestSubmission(submissionId: string) {
    return prisma.testSubmission.update({
        where: { id: submissionId },
        data: { status: 'GRADED' }
    });
}

export async function approveAllTestSubmissions(testId: string) {
    return prisma.testSubmission.updateMany({
        where: { testId, status: 'AWAITING_APPROVAL' },
        data: { status: 'GRADED' }
    });
}

export async function getTeachers(schoolId: string) {
    return prisma.staff.findMany({
        where: {
            schoolId: schoolId,
            staffType: 'TEACHER'
        },
        include: { user: true }
    })
}
