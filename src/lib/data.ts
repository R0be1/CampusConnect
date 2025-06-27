// src/lib/data.ts
'use server';

import { StudentRegistrationFormValues } from '@/app/dashboard/students/student-form';
import prisma from './prisma';
import bcrypt from 'bcrypt';

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
    // Note: The current schema doesn't link a Test directly to an academic year.
    // This function fetches all test submissions for the student, regardless of year.
    // This could be refined later if a direct link is added to the schema.
    const submissions = await prisma.testSubmission.findMany({
        where: {
            studentId,
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
