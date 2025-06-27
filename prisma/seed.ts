
/**
 * Seed the database with initial data.
 *
 * This script is designed to be run with `npx prisma db seed`.
 * It will clear all existing data and create a new set of sample data.
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // --- 1. Clear existing data in the correct order ---
  console.log('Clearing existing data...');
  // Start with models that have the most dependencies
  await prisma.testSubmission.deleteMany().catch(() => {}); // Attempt to delete, but ignore if it fails
  await prisma.testAnswer.deleteMany().catch(() => {});     // Attempt to delete, but ignore if it fails
  await prisma.question.deleteMany();
  await prisma.test.deleteMany();
  await prisma.liveSessionRegistration.deleteMany();
  await prisma.liveSession.deleteMany();
  await prisma.learningMaterial.deleteMany();
  await prisma.communication.deleteMany();
  await prisma.result.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.feePayment.deleteMany();
  await prisma.feeInvoice.deleteMany();
  await prisma.concessionAssignment.deleteMany();
  await prisma.concession.deleteMany();
  await prisma.penaltyRule.deleteMany();
  await prisma.feeStructure.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  
  // Clear profiles and users. It's safer to delete profiles before the base user.
  // Prisma should handle disconnecting M2M relations on student/parent deletion.
  await prisma.parent.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();
  
  // Clear core organizational data
  await prisma.section.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.academicYear.deleteMany();
  await prisma.school.deleteMany();
  console.log('Data cleared.');

  // --- 2. Seed new data ---
  console.log('Seeding new data...');

  // School
  const school1 = await prisma.school.create({
    data: {
      name: 'Greenwood High',
      accountName: 'greenwood-high',
      branch: 'Main Campus',
      contactPerson: 'Mr. John Appleseed',
      phone: '555-0101',
      address: '123 Education Lane, Knowledge City, 12345',
      logoUrl: 'https://placehold.co/40x40/6366f1/ffffff.png',
    },
  });
  console.log(`Created school: ${school1.name}`);

  // Academic Year
  const academicYear = await prisma.academicYear.create({
    data: {
      name: '2024-2025',
      isCurrent: true,
      schoolId: school1.id,
    },
  });
  console.log(`Created academic year: ${academicYear.name}`);

  // Grades & Sections
  const grade10 = await prisma.grade.create({
    data: {
      name: 'Grade 10',
      schoolId: school1.id,
      sections: {
        create: [{ name: 'A' }, { name: 'B' }],
      },
    },
    include: { sections: true },
  });
  console.log(`Created grade: ${grade10.name} with sections A, B`);
  const section10A = grade10.sections.find((s) => s.name === 'A')!;

  // Hash a common password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Users
  const teacherUser = await prisma.user.create({
    data: {
      phone: '1112223331',
      password: hashedPassword,
      role: 'TEACHER',
      schoolId: school1.id,
    },
  });

  const parentUser = await prisma.user.create({
    data: {
      phone: '1112223332',
      password: hashedPassword,
      role: 'PARENT',
      schoolId: school1.id,
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      phone: '1112223333',
      password: hashedPassword,
      role: 'STUDENT',
      schoolId: school1.id,
    },
  });
  console.log('Created teacher, parent, and student users.');

  // Profiles
  const teacherProfile = await prisma.staff.create({
    data: {
      userId: teacherUser.id,
      firstName: 'James',
      lastName: 'Smith',
      staffType: 'TEACHER',
      schoolId: school1.id,
    },
  });

  const parentProfile = await prisma.parent.create({
    data: {
      userId: parentUser.id,
      firstName: 'Jane',
      lastName: 'Doe',
      schoolId: school1.id,
    },
  });

  const studentProfile = await prisma.student.create({
    data: {
      userId: studentUser.id,
      firstName: 'John',
      lastName: 'Doe',
      dob: new Date('2008-05-12'),
      gender: 'MALE',
      schoolId: school1.id,
      gradeId: grade10.id,
      sectionId: section10A.id,
      parents: {
        connect: { id: parentProfile.id },
      },
    },
  });
  console.log('Created staff, parent, and student profiles.');

  // Course & Enrollment
  const mathCourse = await prisma.course.create({
    data: {
      name: 'Mathematics 10',
      gradeId: grade10.id,
      sectionId: section10A.id,
      teacherId: teacherProfile.id,
      schoolId: school1.id,
    },
  });

  await prisma.enrollment.create({
    data: {
      studentId: studentProfile.id,
      courseId: mathCourse.id,
      academicYearId: academicYear.id,
    },
  });
  console.log('Created Math course and enrolled student.');
  
  // Attendance
  await prisma.attendance.create({
      data: {
          studentId: studentProfile.id,
          date: new Date(),
          status: 'PRESENT',
          markedById: teacherProfile.id
      }
  });
  console.log('Created an attendance record.');

  // Test & Submissions
  const algebraTest = await prisma.test.create({
      data: {
          name: 'Algebra Basics',
          gradeId: grade10.id,
          sectionId: section10A.id,
          subject: 'Mathematics',
          teacherId: teacherProfile.id,
          startTime: new Date(),
          endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          duration: 60,
          isMock: false,
          resultVisibility: 'IMMEDIATE',
          questions: {
              create: [
                  {
                      text: 'Solve for x: 2x + 4 = 10',
                      type: 'FILL_IN_THE_BLANK',
                      correctAnswer: '3'
                  },
                   {
                      text: 'Is x=5 a solution to 3x = 15?',
                      type: 'TRUE_FALSE',
                      correctAnswer: 'true'
                  }
              ]
          }
      },
      include: { questions: true }
  });
  console.log('Created an Algebra test with 2 questions.');

  console.log('Seeding finished.');
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
