
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
  // Using .catch() to ignore errors if a model doesn't exist in the schema.
  // This makes the script resilient to schema variations and prevents crashes.
  await prisma.examResult.deleteMany().catch(() => {});
  await prisma.exam.deleteMany().catch(() => {});
  await prisma.testAnswer.deleteMany().catch(() => {});
  await prisma.testSubmission.deleteMany().catch(() => {});
  await prisma.question.deleteMany().catch(() => {});
  await prisma.test.deleteMany().catch(() => {});
  await prisma.liveSessionRegistration.deleteMany().catch(() => {});
  await prisma.liveSession.deleteMany().catch(() => {});
  await prisma.learningMaterial.deleteMany().catch(() => {});
  await prisma.communication.deleteMany().catch(() => {});
  await prisma.result.deleteMany().catch(() => {});
  await prisma.attendance.deleteMany().catch(() => {});
  await prisma.feePayment.deleteMany().catch(() => {});
  await prisma.concessionAssignment.deleteMany().catch(() => {});
  await prisma.feeInvoice.deleteMany().catch(() => {});
  await prisma.concession.deleteMany().catch(() => {});
  await prisma.penaltyTier.deleteMany().catch(() => {});
  await prisma.feeStructure.deleteMany().catch(() => {});
  await prisma.penaltyRule.deleteMany().catch(() => {});
  await prisma.enrollment.deleteMany().catch(() => {});
  await prisma.course.deleteMany().catch(() => {});
  
  // Clear profiles and users. It's safer to delete profiles before the base user.
  await prisma.parent.deleteMany().catch(() => {});
  await prisma.staff.deleteMany().catch(() => {});
  await prisma.student.deleteMany().catch(() => {});
  await prisma.user.deleteMany().catch(() => {});
  
  // Clear core organizational data
  await prisma.section.deleteMany().catch(() => {});
  await prisma.grade.deleteMany().catch(() => {});
  await prisma.academicYear.deleteMany().catch(() => {});
  await prisma.school.deleteMany().catch(() => {});
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
  const academicYear2425 = await prisma.academicYear.create({
    data: {
      name: '2024-2025',
      isCurrent: true,
      schoolId: school1.id,
    },
  });
   const academicYear2324 = await prisma.academicYear.create({
    data: {
      name: '2023-2024',
      isCurrent: false,
      schoolId: school1.id,
    },
  });
  console.log(`Created academic years: ${academicYear2425.name} (current) and ${academicYear2324.name}`);

  // Grades & Sections
  const grade10 = await prisma.grade.create({
    data: { name: 'Grade 10', schoolId: school1.id },
  });
  const grade9 = await prisma.grade.create({
    data: { name: 'Grade 9', schoolId: school1.id },
  });

  const section10A = await prisma.section.create({
    data: { name: 'A', gradeId: grade10.id, schoolId: school1.id },
  });
  const section10B = await prisma.section.create({
    data: { name: 'B', gradeId: grade10.id, schoolId: school1.id },
  });
  const section9A = await prisma.section.create({
    data: { name: 'A', gradeId: grade9.id, schoolId: school1.id },
  });
  const section9B = await prisma.section.create({
    data: { name: 'B', gradeId: grade9.id, schoolId: school1.id },
  });
  console.log(`Created grades with sections.`);

  // Hash a common password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // --- Users & Profiles ---
  console.log('Creating users and profiles...');

  // Teachers
  const teacherUser1 = await prisma.user.create({ data: { phone: '1000000001', password: hashedPassword, role: 'TEACHER', schoolId: school1.id, firstName: 'James', lastName: 'Smith' } });
  const teacher1 = await prisma.staff.create({ data: { userId: teacherUser1.id, firstName: 'James', lastName: 'Smith', staffType: 'TEACHER', schoolId: school1.id } });
  
  const teacherUser2 = await prisma.user.create({ data: { phone: '1000000002', password: hashedPassword, role: 'TEACHER', schoolId: school1.id, firstName: 'Maria', lastName: 'Jones' } });
  const teacher2 = await prisma.staff.create({ data: { userId: teacherUser2.id, firstName: 'Maria', lastName: 'Jones', staffType: 'TEACHER', schoolId: school1.id } });
  
  const teacherUser3 = await prisma.user.create({ data: { phone: '1000000003', password: hashedPassword, role: 'TEACHER', schoolId: school1.id, firstName: 'Robert', lastName: 'Brown' } });
  const teacher3 = await prisma.staff.create({ data: { userId: teacherUser3.id, firstName: 'Robert', lastName: 'Brown', staffType: 'TEACHER', schoolId: school1.id } });

  // Parents
  const parentUser1 = await prisma.user.create({ data: { phone: '2000000001', password: hashedPassword, role: 'PARENT', schoolId: school1.id, firstName: 'Jane', lastName: 'Doe' } });
  const parent1 = await prisma.parent.create({ data: { userId: parentUser1.id, firstName: 'Jane', lastName: 'Doe', schoolId: school1.id, relationToStudent: 'Mother' } });

  const parentUser2 = await prisma.user.create({ data: { phone: '2000000002', password: hashedPassword, role: 'PARENT', schoolId: school1.id, firstName: 'Robert', lastName: 'Smith' } });
  const parent2 = await prisma.parent.create({ data: { userId: parentUser2.id, firstName: 'Robert', lastName: 'Smith', schoolId: school1.id, relationToStudent: 'Father' } });

  // Students
  const studentUser1 = await prisma.user.create({ data: { phone: '3000000001', password: hashedPassword, role: 'STUDENT', schoolId: school1.id, firstName: 'John', lastName: 'Doe' } });
  const student1 = await prisma.student.create({ data: { userId: studentUser1.id, firstName: 'John', lastName: 'Doe', dob: new Date('2008-05-12'), gender: 'MALE', schoolId: school1.id, gradeId: grade10.id, sectionId: section10A.id, parents: { connect: { id: parent1.id } } } });

  const studentUser2 = await prisma.user.create({ data: { phone: '3000000002', password: hashedPassword, role: 'STUDENT', schoolId: school1.id, firstName: 'Alice', lastName: 'Smith' } });
  const student2 = await prisma.student.create({ data: { userId: studentUser2.id, firstName: 'Alice', lastName: 'Smith', dob: new Date('2009-02-20'), gender: 'FEMALE', schoolId: school1.id, gradeId: grade9.id, sectionId: section9B.id, parents: { connect: { id: parent2.id } } } });
  
  console.log('Finished creating users and profiles.');

  // --- Course, Enrollment, & Results ---
  console.log('Creating courses, enrollments, and results...');
  const mathCourse = await prisma.course.create({ data: { name: 'Mathematics 10', gradeId: grade10.id, sectionId: section10A.id, teacherId: teacher1.id, schoolId: school1.id } });
  const historyCourse = await prisma.course.create({ data: { name: 'History 10', gradeId: grade10.id, sectionId: section10A.id, teacherId: teacher2.id, schoolId: school1.id } });
  
  const enrollment1 = await prisma.enrollment.create({
      data: { studentId: student1.id, courseId: mathCourse.id, academicYearId: academicYear2425.id }
  });
  const enrollment2 = await prisma.enrollment.create({
      data: { studentId: student1.id, courseId: historyCourse.id, academicYearId: academicYear2425.id }
  });

  await prisma.result.createMany({
    data: [
      { enrollmentId: enrollment1.id, grade: "A" },
      { enrollmentId: enrollment2.id, grade: "B+" },
    ]
  });
  console.log('Finished creating courses and enrollments.');

  // --- Attendance ---
  await prisma.attendance.create({
      data: {
          studentId: student1.id,
          date: new Date(),
          status: 'PRESENT',
          markedById: teacherUser1.id
      }
  });

  // --- E-Learning ---
  await prisma.learningMaterial.createMany({
    data: [
        { title: 'Introduction to Algebra', description: 'A foundational video covering the basics...', subject: 'Mathematics', gradeId: grade10.id, type: 'VIDEO', schoolId: school1.id, uploaderId: teacherUser1.id },
        { title: 'The Fall of Rome', description: 'A detailed PDF document...', subject: 'History', gradeId: grade9.id, type: 'DOCUMENT', schoolId: school1.id, uploaderId: teacherUser2.id },
    ]
  });
  console.log('Created learning materials.');
  
  // --- Fees ---
  console.log('Creating fee structures...');
  const penaltyRule = await prisma.penaltyRule.create({ data: { name: 'Standard Late Fee', gracePeriod: 5, schoolId: school1.id }});
  const tuitionFee = await prisma.feeStructure.create({ data: { name: 'Tuition Fee - Fall Semester', amount: 2500, interval: 'ONE_TIME', schoolId: school1.id, penaltyRuleId: penaltyRule.id }});
  const siblingDiscount = await prisma.concession.create({ data: { name: 'Sibling Discount', type: 'PERCENTAGE', value: 10, description: 'For families with multiple children', schoolId: school1.id }});
  const feeInvoice = await prisma.feeInvoice.create({
      data: {
          studentId: student1.id,
          feeStructureId: tuitionFee.id,
          academicYearId: academicYear2425.id,
          amount: 2500,
          dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
          status: 'OVERDUE'
      }
  });

  await prisma.feePayment.create({
    data: {
        invoiceId: feeInvoice.id,
        amount: 500, // Partial payment
        paymentDate: new Date(),
        method: 'BANK_TRANSFER',
        status: 'PENDING_VERIFICATION',
        reference: 'TRN-SEED-123',
        schoolId: school1.id
    }
  });
  console.log('Finished creating fee structures.');

  // --- Tests ---
  console.log('Creating tests...');
  const algebraTest = await prisma.test.create({
      data: {
          name: 'Algebra Basics',
          gradeId: grade10.id,
          sectionId: section10A.id,
          subject: 'Mathematics',
          teacherId: teacherUser1.id,
          startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          duration: 60,
          totalMarks: 12,
          isMock: false,
          resultVisibility: 'IMMEDIATE',
          status: 'COMPLETED',
          schoolId: school1.id,
          questions: {
              create: [
                  {
                      text: 'Solve for x: 2x + 4 = 10',
                      type: 'FILL_IN_THE_BLANK',
                      options: '',
                      correctAnswer: '3',
                      points: 10
                  },
                   {
                      text: 'Is x=5 a solution to 3x = 15?',
                      type: 'TRUE_FALSE',
                      options: JSON.stringify(["true", "false"]),
                      correctAnswer: 'true',
                      points: 2
                  }
              ]
          }
      },
      include: { questions: true }
  });
  console.log('Created an Algebra test.');

  const testSubmission = await prisma.testSubmission.create({
      data: {
          testId: algebraTest.id,
          studentId: student1.id,
          submittedAt: new Date(),
          score: 10, // Answered first question correctly
          status: 'AWAITING_APPROVAL'
      }
  });

  await prisma.testAnswer.createMany({
      data: [
          { submissionId: testSubmission.id, questionId: algebraTest.questions[0].id, answer: '3' },
          { submissionId: testSubmission.id, questionId: algebraTest.questions[1].id, answer: 'false' }, // Incorrect answer
      ]
  })
  console.log('Created test submission.');

  // --- Exams ---
  console.log('Creating exams and results...');

  const midTermMath = await prisma.exam.create({
      data: {
          name: 'Mid-term Exam',
          weightage: 40,
          totalMarks: 100,
          gradingType: 'DECIMAL',
          academicYearId: academicYear2425.id,
          gradeId: grade10.id,
          sectionId: section10A.id,
          subject: 'Mathematics',
          schoolId: school1.id,
      }
  });

  const finalMath = await prisma.exam.create({
      data: {
          name: 'Final Exam',
          weightage: 60,
          totalMarks: 100,
          gradingType: 'LETTER',
          academicYearId: academicYear2425.id,
          gradeId: grade10.id,
          sectionId: section10A.id,
          subject: 'Mathematics',
          schoolId: school1.id,
      }
  });

  await prisma.examResult.createMany({
      data: [
          { examId: midTermMath.id, studentId: student1.id, score: '85', status: 'PENDING_APPROVAL' },
      ]
  });
  console.log('Finished creating exams and results.');
  
  // --- Live Sessions ---
  console.log('Creating live sessions...');
  const liveSession = await prisma.liveSession.create({
    data: {
      topic: 'Advanced Algebra Concepts',
      description: 'Deep dive into quadratic equations and functions.',
      subject: 'Mathematics',
      gradeId: grade10.id,
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week from now
      duration: 60,
      fee: 25.00,
      status: 'UPCOMING',
      teacherId: teacher1.id,
      schoolId: school1.id,
    },
  });

  await prisma.liveSessionRegistration.create({
    data: {
      liveSessionId: liveSession.id,
      studentId: student1.id,
    }
  });

  console.log('Finished creating live sessions.');


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
