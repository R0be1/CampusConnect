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
