
// src/lib/data.ts
'use server';

import { StudentRegistrationFormValues } from '@/app/dashboard/students/student-form';
import prisma from './prisma';
import bcrypt from 'bcrypt';
import { differenceInDays, format, startOfMonth, endOfMonth } from 'date-fns';
import type { School } from '@prisma/client';

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
    totalStudents > 0
      ? (presentCount / totalStudents) * 100
      : 0;

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
            createdAt: 'asc'
        }
    });
}

export async function getGrades(schoolId: string) {
    return prisma.grade.findMany({
        where: { schoolId },
        orderBy: { name: 'asc' }
    });
}

export async function getGradesWithSections(schoolId: string) {
    if (!schoolId) return [];
    return prisma.grade.findMany({
        where: { schoolId },
        include: {
            sections: {
                orderBy: {
                    name: 'asc'
                }
            }
        },
        orderBy: {
            name: 'asc'
        }
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

  const students = await prisma.student.findMany({
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
  });
  
  students.sort((a, b) => a.firstName.localeCompare(b.firstName));

  return students;
}

export type DetailedStudent = Awaited<ReturnType<typeof getStudentsWithDetails>>[0];

export async function createStudentWithParent(data: StudentRegistrationFormValues, schoolId: string) {
    const hashedPassword = await bcrypt.hash('password123', 10);

    return prisma.$transaction(async (tx) => {
        // Check if parent already exists by phone number
        let parent = await tx.parent.findFirst({
            where: { user: { phone: data.parentPhone } },
            include: { user: true }
        });

        if (!parent) {
            // Create a new parent if not found
            const parentUser = await tx.user.create({
                data: {
                    phone: data.parentPhone,
                    password: hashedPassword,
                    role: 'PARENT',
                    schoolId,
                    firstName: data.parentFirstName,
                    lastName: data.parentLastName,
                    middleName: data.parentMiddleName,
                    addressLine1: data.addressLine1,
                    city: data.city,
                    state: data.state,
                    zipCode: data.zipCode,
                }
            });
            parent = await tx.parent.create({
                data: {
                    userId: parentUser.id,
                    firstName: data.parentFirstName,
                    lastName: data.parentLastName,
                    schoolId,
                    relationToStudent: data.parentRelation,
                },
                include: { user: true }
            });
        }

        const studentPhone = `${data.parentPhone}-S${Date.now()}`;
        const studentUser = await tx.user.create({
            data: {
                phone: studentPhone,
                password: hashedPassword,
                role: 'STUDENT',
                schoolId,
                firstName: data.studentFirstName,
                lastName: data.studentLastName,
                middleName: data.studentMiddleName,
                addressLine1: parent.user.addressLine1,
                city: parent.user.city,
                state: parent.user.state,
                zipCode: parent.user.zipCode,
            }
        });

        const student = await tx.student.create({
            data: {
                userId: studentUser.id,
                firstName: data.studentFirstName,
                lastName: data.studentLastName,
                schoolId,
                gradeId: data.grade,
                sectionId: data.section,
                dob: data.studentDob,
                gender: data.studentGender,
                parents: { connect: { id: parent.id } }
            }
        });

        return { student, parent };
    });
}

export async function updateStudentWithParent(studentId: string, data: StudentRegistrationFormValues) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { user: true, parents: { include: { user: true } } }
  });

  if (!student) {
    throw new Error('Student not found');
  }

  return prisma.$transaction(async (tx) => {
    await tx.student.update({
      where: { id: studentId },
      data: {
        firstName: data.studentFirstName,
        lastName: data.studentLastName,
        dob: data.studentDob,
        gender: data.studentGender,
        gradeId: data.grade,
        sectionId: data.section,
      }
    });

    if (student.user) {
        await tx.user.update({
          where: { id: student.userId },
          data: {
            firstName: data.studentFirstName,
            lastName: data.studentLastName,
            middleName: data.studentMiddleName,
            addressLine1: data.addressLine1,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
          }
        });
    }

    const parent = student.parents[0];
    if (parent && parent.user) {
      await tx.parent.update({
        where: { id: parent.id },
        data: {
          firstName: data.parentFirstName,
          lastName: data.parentLastName,
          relationToStudent: data.parentRelation,
        }
      });
      await tx.user.update({
        where: { id: parent.userId },
        data: {
          firstName: data.parentFirstName,
          lastName: data.parentLastName,
          middleName: data.parentMiddleName,
          phone: data.parentPhone,
          alternatePhone: data.parentAlternatePhone || null,
          addressLine1: data.addressLine1,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
        }
      });
    }
    
    return tx.student.findUnique({
      where: { id: studentId },
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
    });
  });
}

export async function deleteStudent(studentId: string) {
  return prisma.$transaction(async (tx) => {
    const student = await tx.student.findUnique({
      where: { id: studentId },
      select: { userId: true },
    });

    if (!student) {
      throw new Error("Student not found.");
    }
    
    await tx.student.update({
      where: { id: studentId },
      data: {
        parents: {
          set: [],
        },
      },
    });

    await tx.student.delete({
      where: { id: studentId },
    });

    await tx.user.delete({
      where: { id: student.userId },
    });

    return { success: true };
  });
}


// --- Academics Data ---

export async function getFirstStudent(schoolId: string) {
    return prisma.student.findFirst({
        where: { schoolId },
        orderBy: { user: { createdAt: 'asc' } }
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
                    teacher: true
                }
            },
            results: {
                orderBy: {
                    date: 'desc'
                },
                take: 1
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
    const examResults = await prisma.examResult.findMany({
        where: {
            studentId,
            exam: {
                academicYearId,
            }
        },
        include: {
            exam: true
        },
        orderBy: {
          exam: {
            name: 'asc'
          }
        }
    });
    
    return examResults.map((s, index) => ({
        exam: s.exam.name,
        subject: s.exam.subject,
        score: s.score,
        rank: `#${index + 1}` // Placeholder rank
    }));
}

// --- Attendance Data ---
export async function getFirstTeacher(schoolId: string) {
    return prisma.staff.findFirst({
        where: { schoolId, staffType: 'TEACHER' },
    });
}

export async function getStudentsForAttendance(gradeId: string, sectionId: string) {
  if (!gradeId || !sectionId) return [];

  const students = await prisma.student.findMany({
    where: { gradeId, sectionId },
    select: { id: true, firstName: true, lastName: true },
  });

  students.sort((a,b) => a.firstName.localeCompare(b.firstName));
  return students;
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
    status: string; // 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
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
        select: { id: true, firstName: true, lastName: true },
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
            name: `${student.firstName} ${student.lastName}`,
            present: studentRecords.filter(r => r.status === 'PRESENT').length,
            absent: studentRecords.filter(r => r.status === 'ABSENT').length,
            late: studentRecords.filter(r => r.status === 'LATE').length,
            excused: studentRecords.filter(r => r.status === 'EXCUSED').length,
        };
    });

    summary.sort((a,b) => a.name.localeCompare(b.name));

    return summary;
}

// --- Communication Data ---
export async function getStudentsForCommunication(schoolId: string) {
  const students = await prisma.student.findMany({
    where: { schoolId },
    include: {
      user: true,
      grade: {
        select: { name: true },
      },
      section: {
        select: { name: true },
      },
      parents: {
        include: {
            user: true
        },
        take: 1, // Assume one parent for simplicity
      },
    },
  });

  students.sort((a,b) => a.firstName.localeCompare(b.firstName));
  return students;
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
    include: {
      student: {
        select: {
            user: {
                select: {
                    firstName: true,
                    lastName: true
                }
            }
        }
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
        include: { student: { include: { user: {select: {firstName: true, lastName: true}} } }, concession: true },
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
    const totalMarks = questions.reduce((acc: number, q: any) => acc + (parseInt(q.points) || 0), 0)

    return prisma.test.create({
        data: {
            ...testData,
            schoolId,
            teacherId,
            duration: parseInt(testData.duration),
            totalMarks,
            questions: {
                create: questions.map((q: any) => ({
                    ...q,
                    points: parseInt(q.points) || 1,
                    options: q.options ? JSON.stringify(q.options) : "",
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

export async function updateTestStatus(testId: string, status: string) {
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

// --- E-Learning Data ---
export async function getLearningMaterials(schoolId: string) {
    if (!schoolId) return [];
    return prisma.learningMaterial.findMany({
        where: { schoolId },
        include: {
            grade: true,
            uploader: {
                select: {
                    firstName: true,
                    lastName: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc',
        }
    });
}


// --- Live Sessions ---
export async function getLiveSessions(schoolId: string) {
    if (!schoolId) return [];
    return prisma.liveSession.findMany({
        where: { schoolId },
        include: {
            grade: true,
            teacher: {
                select: {
                    firstName: true,
                    lastName: true,
                }
            },
            _count: {
                select: { registrations: true },
            }
        },
        orderBy: {
            startTime: 'desc',
        },
    });
}
export type LiveSessionWithDetails = Awaited<ReturnType<typeof getLiveSessions>>[0];


export async function getLiveSessionById(sessionId: string) {
    if (!sessionId) return null;
    return prisma.liveSession.findUnique({
        where: { id: sessionId },
        include: {
             _count: {
                select: { registrations: true },
            }
        }
    });
}
export type LiveSessionForPage = NonNullable<Awaited<ReturnType<typeof getLiveSessionById>>>;

export async function createLiveSession(data: any, schoolId: string, teacherId: string) {
    return prisma.liveSession.create({
        data: {
            ...data,
            schoolId,
            teacherId
        },
    });
}

// --- Settings ---

export async function updateSchoolProfile(schoolId: string, data: any) {
    return prisma.school.update({
        where: { id: schoolId },
        data: data
    });
}

export async function createAcademicYear(name: string, schoolId: string) {
    return prisma.academicYear.create({
        data: { name, schoolId }
    });
}

export async function setCurrentAcademicYear(id: string, schoolId: string) {
    return prisma.$transaction([
        prisma.academicYear.updateMany({
            where: { schoolId, isCurrent: true },
            data: { isCurrent: false },
        }),
        prisma.academicYear.update({
            where: { id },
            data: { isCurrent: true },
        }),
    ]);
}

export async function deleteAcademicYear(id: string) {
    return prisma.academicYear.delete({ where: { id } });
}

export async function createGrade(name: string, schoolId: string) {
    return prisma.grade.create({
        data: { name, schoolId }
    });
}

export async function deleteGrade(id: string) {
    return prisma.grade.delete({ where: { id } });
}

export async function createSection(name: string, gradeId: string, schoolId: string) {
    return prisma.section.create({
        data: { name, gradeId, schoolId }
    });
}

export async function deleteSection(id: string) {
    return prisma.section.delete({ where: { id } });
}

export async function getCoursesWithDetails(schoolId: string) {
    return prisma.course.findMany({
        where: { schoolId },
        include: {
            grade: true,
            section: true,
            teacher: {
                include: {
                    user: true
                }
            }
        },
        orderBy: { name: 'asc' }
    });
}

export async function createCourse(data: { name: string, gradeId: string, sectionId: string, teacherId: string, schoolId: string }) {
    return prisma.course.create({ data });
}

export async function updateCourse(id: string, data: { name: string, gradeId: string, sectionId: string, teacherId: string }) {
    return prisma.course.update({ where: { id }, data });
}

export async function deleteCourse(id: string) {
    return prisma.course.delete({ where: { id } });
}

// --- Result Actions ---

async function getStudentsForExam(examId: string) {
    const exam = await prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) return [];
    const students = await prisma.student.findMany({
        where: { gradeId: exam.gradeId, sectionId: exam.sectionId }
    });
    students.sort((a,b) => a.firstName.localeCompare(b.firstName));
    return students;
}

async function getResultsForExam(examId: string) {
    return prisma.examResult.findMany({
        where: { examId },
        include: { student: { include: { user: true } } }
    });
}

export async function getResultsForExamAction(examId: string) {
    try {
        const students = await getStudentsForExam(examId);
        const results = await getResultsForExam(examId);
        const exam = await prisma.exam.findUnique({ where: { id: examId } });

        const data = students.map(student => {
            const result = results.find(r => r.studentId === student.id);
            return {
                id: student.id,
                name: `${student.firstName} ${student.lastName}`,
                score: result?.score || '',
                status: result?.status || 'PENDING'
            };
        });
        return { success: true, data, gradingType: exam?.gradingType };
    } catch (e: any) {
        return { success: false, error: "Failed to fetch results." };
    }
}

export async function submitResultsForApprovalAction(examId: string, results: {studentId: string, score: string, status: string}[]) {
    try {
        await prisma.$transaction(async (tx) => {
            for (const result of results) {
                if (!result.score) continue; 

                const currentResult = await tx.examResult.findUnique({
                    where: { examId_studentId: { examId, studentId: result.studentId } }
                });

                let newStatus: any = currentResult?.status || 'PENDING';
                if (newStatus === 'PENDING') newStatus = 'PENDING_APPROVAL';
                if (newStatus === 'APPROVED') newStatus = 'PENDING_REAPPROVAL';
                
                await tx.examResult.upsert({
                    where: { examId_studentId: { examId, studentId: result.studentId } },
                    update: { score: result.score, status: newStatus },
                    create: { examId, studentId: result.studentId, score: result.score, status: 'PENDING_APPROVAL' },
                });
            }
        });
        revalidatePath('/dashboard/results/enter-results');
        revalidatePath('/dashboard/results/approve-results');
        return { success: true, message: "Results submitted for approval." };
    } catch (e: any) {
        return { success: false, error: "Failed to submit results." };
    }
}


export async function getApprovalsForExamAction(examId: string) {
     try {
        const results = await prisma.examResult.findMany({
            where: { examId, status: { in: ['PENDING_APPROVAL', 'PENDING_REAPPROVAL'] } },
            include: { student: {select: {firstName: true, lastName: true}} }
        });
         const data = results.map(r => ({
            id: r.id, 
            studentId: r.studentId,
            name: `${r.student.firstName} ${r.student.lastName}`,
            score: r.score,
            status: r.status,
         }));
        return { success: true, data };
    } catch (e: any) {
        return { success: false, error: "Failed to fetch approvals." };
    }
}

export async function updateResultStatusAction(resultId: string, action: 'approve' | 'reject') {
    try {
        const result = await prisma.examResult.findUnique({ where: { id: resultId } });
        if (!result) throw new Error("Result not found");

        let newStatus: any = result.status;
        if (action === 'approve') {
            newStatus = result.status === 'PENDING_REAPPROVAL' ? 'FINALIZED' : 'APPROVED';
        } else {
            newStatus = result.status === 'PENDING_REAPPROVAL' ? 'APPROVED' : 'PENDING';
        }

        await prisma.examResult.update({
            where: { id: resultId },
            data: { status: newStatus }
        });
        
        revalidatePath('/dashboard/results/approve-results');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: "Failed to update status." };
    }
}

export async function bulkUpdateResultStatusAction(examId: string, action: 'approve' | 'reject') {
    try {
        const resultsToUpdate = await prisma.examResult.findMany({
            where: { examId, status: { in: ['PENDING_APPROVAL', 'PENDING_REAPPROVAL'] } },
        });

        await prisma.$transaction(async (tx) => {
            for (const result of resultsToUpdate) {
                let newStatus: any = result.status;
                if (action === 'approve') {
                    newStatus = result.status === 'PENDING_REAPPROVAL' ? 'FINALIZED' : 'APPROVED';
                } else {
                    newStatus = result.status === 'PENDING_REAPPROVAL' ? 'APPROVED' : 'PENDING';
                }
                 await tx.examResult.update({
                    where: { id: result.id },
                    data: { status: newStatus }
                });
            }
        });
        
        revalidatePath('/dashboard/results/approve-results');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: "Failed to bulk update." };
    }
}


// --- Parent Portal Data ---

export async function getParentsWithChildrenForPortal() {
    const school = await getFirstSchool();
    if (!school) return [];

    return prisma.parent.findMany({
        where: {
            schoolId: school.id,
            students: {
                some: {} // Only get parents who have at least one student
            }
        },
        include: {
            user: {
                select: {
                    firstName: true,
                    lastName: true
                }
            },
            students: {
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                        }
                    },
                },
                 orderBy: {
                    firstName: 'asc'
                }
            }
        },
        orderBy: {
            user: {
                firstName: 'asc'
            }
        }
    });
}
export type ParentsWithChildren = Awaited<ReturnType<typeof getParentsWithChildrenForPortal>>;


export async function getPortalDashboardData(studentId: string, academicYearId: string) {
    // 1. Get student and parent info
    const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
            user: true,
            grade: true,
            section: true,
            parents: {
                include: {
                    user: true
                }
            }
        }
    });

    if (!student || !student.parents.length) {
        throw new Error("Student or parent not found");
    }
    const parent = student.parents[0];

    // 2. Get Attendance Summary for current month
    const today = new Date();
    const start = startOfMonth(today);
    const end = endOfMonth(today);

    const attendanceRecords = await prisma.attendance.findMany({
        where: { studentId, date: { gte: start, lte: end } }
    });
    const attendanceSummary = {
        present: attendanceRecords.filter(r => r.status === 'PRESENT').length,
        absent: attendanceRecords.filter(r => r.status === 'ABSENT').length,
        late: attendanceRecords.filter(r => r.status === 'LATE').length,
        total: attendanceRecords.length,
    };

    // 3. Get Recent Grades
    const gradesData = await getGradesForStudent(studentId, academicYearId);

    // 4. Get Fee Summary
    const invoices = await getInvoicesForStudent(studentId);
    const outstandingInvoices = invoices.filter(inv => inv.status === 'OVERDUE' || inv.status === 'PENDING');
    const outstandingBalance = outstandingInvoices.reduce((acc, inv) => {
        const total = (inv.amount - (inv.concession?.amount ?? 0)) + inv.lateFee;
        return acc + total;
    }, 0);

    // 5. Get Recent Communications
    const recentCommunications = await prisma.communication.findMany({
        where: { receiverId: parent.userId },
        include: { sender: { select: { firstName: true, lastName: true } } },
        orderBy: { sentAt: 'desc' },
        take: 5
    });

    return {
        student: {
            name: `${student.firstName} ${student.lastName}`,
            grade: student.grade.name,
            section: student.section.name,
            avatar: student.user.photoUrl || `https://placehold.co/80x80.png`,
            parentName: `${parent.firstName} ${parent.lastName}`,
        },
        attendanceSummary,
        gradesData: gradesData.slice(0, 4),
        feeSummary: {
            outstanding: outstandingBalance,
            invoices: outstandingInvoices.map(inv => ({
                id: inv.id,
                item: inv.feeStructure.name,
                total: (inv.amount - (inv.concession?.amount ?? 0)) + inv.lateFee,
                dueDate: format(inv.dueDate, "yyyy-MM-dd"),
                status: inv.status,
            })),
        },
        recentCommunications: recentCommunications.map(msg => ({
            id: msg.id,
            date: format(msg.sentAt, "yyyy-MM-dd"),
            subject: msg.subject,
            sentBy: `${msg.sender.firstName} ${msg.sender.lastName}`,
            unread: !msg.isRead,
        })),
    };
}
export type PortalDashboardData = Awaited<ReturnType<typeof getPortalDashboardData>>;

export async function getAcademicDataForStudentPortal(studentId: string, academicYearId: string) {
    const results = await prisma.examResult.findMany({
        where: {
            studentId,
            exam: {
                academicYearId,
            },
        },
        include: {
            exam: true,
        },
        orderBy: {
            exam: {
                name: 'asc',
            },
        },
    });

    if (!results.length) {
        return null;
    }

    const schoolId = results[0].exam.schoolId;
    const allExamsInYear = await prisma.exam.findMany({
        where: { academicYearId, schoolId },
        include: { 
            results: { select: { score: true } },
        },
    });

    const classAverages: Record<string, number> = {};
    for (const exam of allExamsInYear) {
        if (exam.results.length > 0 && exam.totalMarks > 0) {
            const totalScore = exam.results.reduce((acc, res) => {
                const scoreNum = parseFloat(res.score);
                return acc + (isNaN(scoreNum) ? 0 : scoreNum);
            }, 0);
            const averagePercentage = (totalScore / exam.results.length / exam.totalMarks) * 100;
            classAverages[exam.id] = parseFloat(averagePercentage.toFixed(1));
        } else {
            classAverages[exam.id] = 0;
        }
    }

    const dataBySubject = results.reduce((acc, result) => {
        const subject = result.exam.subject;
        if (!acc[subject]) {
            acc[subject] = {
                exams: [],
                overallScore: 0,
            };
        }
        if (result.exam.totalMarks > 0) {
            acc[subject].exams.push({
                name: result.exam.name,
                score: parseFloat(result.score),
                totalMarks: result.exam.totalMarks,
                rank: Math.floor(Math.random() * 10) + 1, // Mock rank for now
                classAverage: classAverages[result.exam.id] || 80,
            });
        }
        return acc;
    }, {} as Record<string, { exams: any[], overallScore: number }>);

    for (const subject in dataBySubject) {
        const subjectData = dataBySubject[subject];
        if (subjectData.exams.length > 0) {
            let totalWeightedScore = 0;
            let totalWeightage = 0;

            const allExamsForSubject = allExamsInYear.filter(e => e.subject === subject);

            subjectData.exams.forEach((exam) => {
                if (exam.totalMarks > 0) {
                    const examDetails = allExamsForSubject.find(e => e.name === exam.name);
                    const weightage = examDetails?.weightage || 0;
                    totalWeightedScore += (exam.score / exam.totalMarks) * weightage;
                    totalWeightage += weightage;
                }
            });
            subjectData.overallScore = totalWeightage > 0 ? (totalWeightedScore / totalWeightage) * 100 : 0;
        }
    }

    return dataBySubject;
}
export type AcademicsDataForPortal = Awaited<ReturnType<typeof getAcademicDataForStudentPortal>>;

export async function getAttendanceForStudentPortal(studentId: string, month: number, year: number) {
    if (!studentId) return [];

    const startDate = startOfMonth(new Date(year, month));
    const endDate = endOfMonth(new Date(year, month));

    const attendanceRecords = await prisma.attendance.findMany({
        where: {
            studentId: studentId,
            date: { gte: startDate, lte: endDate },
        },
        select: { date: true, status: true, notes: true },
        orderBy: { date: 'asc' },
    });
    
    return attendanceRecords.map(r => ({
        date: r.date.toISOString().split('T')[0], // Return as YYYY-MM-DD string
        status: r.status as 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED',
        notes: r.notes
    }));
}
export type PortalAttendanceData = Awaited<ReturnType<typeof getAttendanceForStudentPortal>>;

export async function getCommunicationsForParentPortal(studentId: string) {
    const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: { parents: { select: { userId: true } } }
    });

    if (!student || !student.parents.length) {
        return [];
    }
    const parentUserId = student.parents[0].userId;

    return prisma.communication.findMany({
        where: {
            receiverId: parentUserId,
        },
        include: {
            sender: {
                select: {
                    firstName: true,
                    lastName: true,
                }
            }
        },
        orderBy: {
            sentAt: 'desc'
        }
    });
}
export type PortalCommunicationData = Awaited<ReturnType<typeof getCommunicationsForParentPortal>>;

export async function markCommunicationAsRead(communicationId: string) {
    return prisma.communication.update({
        where: { id: communicationId },
        data: { isRead: true }
    });
}

export async function getTestsForStudentPortal(studentId: string) {
    const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: { gradeId: true, sectionId: true }
    });

    if (!student) {
        return [];
    }

    const now = new Date();

    const tests = await prisma.test.findMany({
        where: {
            gradeId: student.gradeId,
            sectionId: student.sectionId
        },
        orderBy: {
            startTime: 'desc'
        }
    });

    // Check if a submission exists for each test
    const testIds = tests.map(t => t.id);
    const submissions = await prisma.testSubmission.findMany({
        where: {
            studentId: studentId,
            testId: { in: testIds }
        },
        select: { testId: true }
    });
    const submittedTestIds = new Set(submissions.map(s => s.testId));

    return tests.map(test => {
        let status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'SUBMITTED';

        if (submittedTestIds.has(test.id)) {
            status = 'SUBMITTED';
        } else if (now < new Date(test.startTime)) {
            status = 'UPCOMING';
        } else if (now >= new Date(test.startTime) && now <= new Date(test.endTime)) {
            status = 'ACTIVE';
        } else {
            status = 'COMPLETED';
        }
        
        if (test.status === 'COMPLETED' && status !== 'SUBMITTED') {
            status = 'COMPLETED';
        }

        return {
            ...test,
            status,
        };
    });
}

export async function getTestDetailsForStudent(testId: string, studentId: string) {
    const test = await prisma.test.findUnique({
        where: { id: testId },
        include: { questions: {
            select: { id: true, text: true, type: true, options: true, points: true }
        }}
    });

    if (!test) throw new Error("Test not found.");

    const student = await prisma.student.findUnique({ where: { id: studentId }});
    if (!student || student.gradeId !== test.gradeId || student.sectionId !== test.sectionId) {
        throw new Error("You are not eligible for this test.");
    }
    
    const now = new Date();
    if (test.status !== 'ACTIVE') {
         if (now < new Date(test.startTime) || now > new Date(test.endTime)) {
            throw new Error("This test is not currently active.");
        }
    }
    
    const existingSubmission = await prisma.testSubmission.findFirst({
        where: { testId, studentId }
    });
    if (existingSubmission) {
        throw new Error("You have already submitted this test.");
    }

    return test;
}

export async function submitTestForStudent(testId: string, studentId: string, answers: { questionId: string, answer: string }[]) {
    const test = await prisma.test.findUnique({
        where: { id: testId },
        include: { questions: true }
    });
    if (!test) throw new Error("Test not found");

    let score = 0;
    for (const question of test.questions) {
        const studentAnswer = answers.find(a => a.questionId === question.id);
        if (studentAnswer && studentAnswer.answer === question.correctAnswer) {
            score += question.points;
        }
    }

    const submission = await prisma.testSubmission.create({
        data: {
            testId,
            studentId,
            score,
            submittedAt: new Date(),
            status: test.isMock ? 'GRADED' : 'AWAITING_APPROVAL',
            answers: {
                create: answers.map(a => ({
                    questionId: a.questionId,
                    answer: a.answer
                }))
            }
        }
    });

    return submission;
}

export async function getTestResultForStudent(testId: string, studentId: string) {
    const submission = await prisma.testSubmission.findFirst({
        where: { testId, studentId },
        include: {
            test: {
                include: {
                    questions: true
                }
            },
            answers: true
        }
    });

    if (!submission) {
        return null;
    }
    
    const { test } = submission;
    const now = new Date();
    
    const areResultsVisible = 
        test.isMock ||
        submission.status === 'GRADED' ||
        test.resultVisibility === "IMMEDIATE" || 
        (test.resultVisibility === "AFTER_END_TIME" && now > new Date(test.endTime));
    
    if (!areResultsVisible) {
        return {
            id: submission.id,
            testName: test.name,
            endTime: test.endTime.toISOString(),
            resultsVisible: false
        };
    }

    return {
        ...submission,
        testName: test.name,
        totalMarks: test.totalMarks,
        questions: test.questions,
        resultsVisible: true,
    };
}

export async function getLearningMaterialsForPortal(studentId: string) {
    const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: { gradeId: true }
    });

    if (!student) {
        return [];
    }

    return prisma.learningMaterial.findMany({
        where: {
            gradeId: student.gradeId
        },
        include: {
            grade: { select: { name: true } }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}
export type PortalELearningData = Awaited<ReturnType<typeof getLearningMaterialsForPortal>>;

export async function getLiveSessionsForPortal(studentId: string) {
    const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: { gradeId: true }
    });

    if (!student) {
        return [];
    }

    // Get all sessions for the student's grade
    const sessions = await prisma.liveSession.findMany({
        where: {
            gradeId: student.gradeId,
            status: { in: ['UPCOMING', 'ACTIVE'] } // Only show relevant sessions
        },
        include: {
            teacher: {
                select: {
                    firstName: true,
                    lastName: true
                }
            },
            registrations: {
                where: {
                    studentId: studentId
                }
            }
        },
        orderBy: {
            startTime: 'asc'
        }
    });

    // Add an 'isRegistered' flag
    return sessions.map(session => ({
        ...session,
        isRegistered: session.registrations.length > 0
    }));
}
export type PortalLiveSessionsData = Awaited<ReturnType<typeof getLiveSessionsForPortal>>;

export async function registerForLiveSession(sessionId: string, studentId: string) {
    // Check if already registered
    const existingRegistration = await prisma.liveSessionRegistration.findFirst({
        where: {
            liveSessionId: sessionId,
            studentId: studentId,
        }
    });

    if (existingRegistration) {
        throw new Error("Already registered for this session.");
    }
    
    // In a real app, you would handle payment here if fee > 0

    return prisma.liveSessionRegistration.create({
        data: {
            liveSessionId: sessionId,
            studentId: studentId
        }
    });
}

export async function getProfileDataForPortal(studentId: string) {
    const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
            user: true,
            grade: { select: { name: true } },
            section: { select: { name: true } },
            parents: {
                include: {
                    user: true
                },
                take: 1
            }
        }
    });

    if (!student || !student.parents.length) {
        return null;
    }

    const parent = student.parents[0];

    return {
        student: {
            id: student.id,
            firstName: student.firstName,
            middleName: student.user.middleName,
            lastName: student.lastName,
            dob: student.dob ? format(student.dob, "yyyy-MM-dd") : '',
            gender: student.gender,
            grade: student.grade.name,
            section: student.section.name
        },
        parent: {
            id: parent.id,
            userId: parent.userId,
            firstName: parent.firstName,
            middleName: parent.user.middleName,
            lastName: parent.lastName,
            relation: parent.relationToStudent,
            phone: parent.user.phone,
            alternatePhone: parent.user.alternatePhone
        },
        address: {
            line1: student.user.addressLine1,
            city: student.user.city,
            state: student.user.state,
            zipCode: student.user.zipCode
        }
    };
}
export type PortalProfileData = NonNullable<Awaited<ReturnType<typeof getProfileDataForPortal>>>;

export async function getStudentProfileForStudentPortal(studentId: string) {
    const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
            user: true,
            grade: { select: { name: true } },
            section: { select: { name: true } },
            parents: {
                include: {
                    user: true
                },
                take: 1
            }
        }
    });

    if (!student) {
        return null;
    }

    const parent = student.parents[0];

    return {
        student: {
            id: student.id,
            firstName: student.firstName,
            middleName: student.user.middleName,
            lastName: student.lastName,
            dob: student.dob ? format(student.dob, "yyyy-MM-dd") : '',
            gender: student.gender,
            grade: student.grade.name,
            section: student.section.name,
            phone: student.user.phone,
        },
        parent: parent ? {
            firstName: parent.firstName,
            lastName: parent.lastName,
            relation: parent.relationToStudent,
            phone: parent.user.phone,
        } : null,
        address: {
            line1: student.user.addressLine1,
            city: student.user.city,
            state: student.user.state,
            zipCode: student.user.zipCode
        }
    };
}
export type StudentProfileData = NonNullable<Awaited<ReturnType<typeof getStudentProfileForStudentPortal>>>;


export async function updateParentContactInfo(userId: string, data: { phone: string; alternatePhone?: string | null }) {
    return prisma.user.update({
        where: { id: userId },
        data: {
            phone: data.phone,
            alternatePhone: data.alternatePhone,
        }
    });
}

export async function updateParentAddress(userId: string, data: { line1: string; city: string; state: string; zipCode: string }) {
     return prisma.user.update({
        where: { id: userId },
        data: {
            addressLine1: data.line1,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode
        }
    });
}

// --- Student Portal Data ---
export async function getStudentDashboardData(studentId: string, academicYearId: string) {
    // 1. Get student info
    const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
            user: true,
            grade: true,
            section: true,
        }
    });

    if (!student) {
        throw new Error("Student not found");
    }

    // 2. Get Upcoming Tests
    const now = new Date();
    const upcomingTests = await prisma.test.findMany({
        where: {
            gradeId: student.gradeId,
            sectionId: student.sectionId,
            startTime: { gte: now },
            status: 'UPCOMING'
        },
        orderBy: {
            startTime: 'asc'
        },
        take: 2 // Limit to 2 for the dashboard
    });

    // 3. Get Recent Grades from Exams
    const recentGrades = await prisma.examResult.findMany({
        where: {
            studentId,
            exam: {
                academicYearId,
            }
        },
        include: {
            exam: true
        },
        orderBy: {
            exam: {
                name: 'desc'
            }
        },
        take: 2 // Limit to 2 for the dashboard
    });

    // 4. Get Attendance Summary for current month
    const today = new Date();
    const start = startOfMonth(today);
    const end = endOfMonth(today);

    const attendanceRecords = await prisma.attendance.findMany({
        where: { studentId, date: { gte: start, lte: end } }
    });
    const attendanceSummary = {
        present: attendanceRecords.filter(r => r.status === 'PRESENT').length,
        absent: attendanceRecords.filter(r => r.status === 'ABSENT').length,
        late: attendanceRecords.filter(r => r.status === 'LATE').length,
        total: attendanceRecords.length,
    };

    return {
        student: {
            name: `${student.firstName} ${student.lastName}`,
            grade: student.grade.name,
            section: student.section.name,
            avatar: student.user.photoUrl,
        },
        upcomingTests,
        recentGrades: recentGrades.map(g => ({
            course: g.exam.subject,
            exam: g.exam.name,
            grade: g.score,
        })),
        attendanceSummary,
    };
}
export type StudentDashboardData = Awaited<ReturnType<typeof getStudentDashboardData>>;

// --- System Admin ---
export async function getSystemAdminDashboardStats() {
  const totalSchoolsPromise = prisma.school.count();
  const totalStudentsPromise = prisma.student.count();

  const [totalSchools, totalStudents] = await Promise.all([
    totalSchoolsPromise,
    totalStudentsPromise,
  ]);

  return { totalSchools, totalStudents };
}

export async function getSchools() {
    return prisma.school.findMany({
        orderBy: { name: 'asc' }
    });
}

export async function getSchoolById(id: string) {
    return prisma.school.findUnique({
        where: { id }
    });
}

export async function createSchool(data: Omit<School, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.school.create({ data });
}

export async function updateSchool(id: string, data: Partial<Omit<School, 'id' | 'createdAt' | 'updatedAt'>>) {
    return prisma.school.update({
        where: { id },
        data,
    });
}

export async function deleteSchool(id: string) {
    return prisma.school.delete({ where: { id } });
}
