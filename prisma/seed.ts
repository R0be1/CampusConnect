
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
  
  await prisma.parent.deleteMany().catch(() => {});
  await prisma.staff.deleteMany().catch(() => {});
  await prisma.student.deleteMany().catch(() => {});
  await prisma.user.deleteMany().catch(() => {});
  
  await prisma.section.deleteMany().catch(() => {});
  await prisma.grade.deleteMany().catch(() => {});
  await prisma.academicYear.deleteMany().catch(() => {});
  await prisma.school.deleteMany().catch(() => {});
  console.log('Data cleared.');

  // --- 2. Seed new data ---
  console.log('Seeding new data...');

  const school1 = await prisma.school.create({
    data: {
      name: 'Greenwood High',
      accountName: 'greenwood-high',
      branch: 'Main Campus',
      contactPerson: 'Mr. John Appleseed',
      phone: '555-0101',
      address: '123 Education Lane, Knowledge City, 12345',
      logoUrl: 'https://static.vecteezy.com/system/resources/previews/022/530/575/non_2x/school-building-exterior-vector-illustration-png.png',
    },
  });
  console.log(`Created school: ${school1.name}`);

  const academicYear2425 = await prisma.academicYear.create({
    data: { name: '2024-2025', isCurrent: true, schoolId: school1.id },
  });
  const academicYear2324 = await prisma.academicYear.create({
    data: { name: '2023-2024', isCurrent: false, schoolId: school1.id },
  });
  console.log(`Created academic years: ${academicYear2425.name} (current) and ${academicYear2324.name}`);

  const grade10 = await prisma.grade.create({ data: { name: 'Grade 10', schoolId: school1.id } });
  const grade9 = await prisma.grade.create({ data: { name: 'Grade 9', schoolId: school1.id } });
  const section10A = await prisma.section.create({ data: { name: 'A', gradeId: grade10.id, schoolId: school1.id } });
  const section9B = await prisma.section.create({ data: { name: 'B', gradeId: grade9.id, schoolId: school1.id } });
  console.log(`Created grades with sections.`);

  const hashedPassword = await bcrypt.hash('password123', 10);
  const userPhotoUrl = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  console.log('Creating users and profiles...');
  const teacherUser1 = await prisma.user.create({ data: { phone: '1000000001', password: hashedPassword, role: 'TEACHER', schoolId: school1.id, firstName: 'James', lastName: 'Smith', photoUrl: userPhotoUrl } });
  const teacher1 = await prisma.staff.create({ data: { userId: teacherUser1.id, firstName: 'James', lastName: 'Smith', staffType: 'TEACHER', schoolId: school1.id } });
  const parentUser1 = await prisma.user.create({ data: { phone: '2000000001', password: hashedPassword, role: 'PARENT', schoolId: school1.id, firstName: 'Jane', lastName: 'Doe', photoUrl: userPhotoUrl } });
  const parent1 = await prisma.parent.create({ data: { userId: parentUser1.id, firstName: 'Jane', lastName: 'Doe', schoolId: school1.id, relationToStudent: 'Mother' } });
  const studentUser1 = await prisma.user.create({ data: { phone: '3000000001', password: hashedPassword, role: 'STUDENT', schoolId: school1.id, firstName: 'John', lastName: 'Doe', photoUrl: userPhotoUrl } });
  const student1 = await prisma.student.create({ data: { userId: studentUser1.id, firstName: 'John', lastName: 'Doe', dob: new Date('2008-05-12'), gender: 'MALE', schoolId: school1.id, gradeId: grade10.id, sectionId: section10A.id, parents: { connect: { id: parent1.id } } } });
  const studentUser2 = await prisma.user.create({ data: { phone: '3000000002', password: hashedPassword, role: 'STUDENT', schoolId: school1.id, firstName: 'Alice', lastName: 'Doe', photoUrl: userPhotoUrl } });
  const student2 = await prisma.student.create({ data: { userId: studentUser2.id, firstName: 'Alice', lastName: 'Doe', dob: new Date('2009-02-20'), gender: 'FEMALE', schoolId: school1.id, gradeId: grade9.id, sectionId: section9B.id, parents: { connect: { id: parent1.id } } } });
  console.log('Finished creating users and profiles.');

  console.log('Creating courses, enrollments, and results...');
  const mathCourse = await prisma.course.create({ data: { name: 'Mathematics 10', gradeId: grade10.id, sectionId: section10A.id, teacherId: teacher1.id, schoolId: school1.id } });
  await prisma.enrollment.create({ data: { studentId: student1.id, courseId: mathCourse.id, academicYearId: academicYear2425.id } });
  console.log('Finished creating courses and enrollments.');

  // --- Fees ---
  console.log('Creating fee structures...');
  const standardPenalty = await prisma.penaltyRule.create({ 
    data: { 
      name: 'Standard Late Fee', 
      gracePeriod: 5, 
      schoolId: school1.id,
      tiers: {
        create: [
          { fromDay: 6, toDay: 15, type: 'FIXED', value: 25, frequency: 'ONE_TIME' },
          { fromDay: 16, toDay: null, type: 'FIXED', value: 100, frequency: 'ONE_TIME' },
        ]
      }
    }
  });

  const tuitionFee = await prisma.feeStructure.create({ data: { name: 'Tuition Fee - Fall Semester', amount: 2500, interval: 'ONE_TIME', schoolId: school1.id, penaltyRuleId: standardPenalty.id }});
  const busFee = await prisma.feeStructure.create({ data: { name: 'Bus Fee - Fall Semester', amount: 300, interval: 'ONE_TIME', schoolId: school1.id, penaltyRuleId: standardPenalty.id }});
  const siblingDiscount = await prisma.concession.create({ data: { name: 'Sibling Discount', type: 'PERCENTAGE', value: 10, description: 'For families with multiple children', schoolId: school1.id }});
  
  // Assign concession to student 2
  await prisma.concessionAssignment.create({
    data: {
      studentId: student2.id,
      concessionId: siblingDiscount.id,
      academicYearId: academicYear2425.id,
    }
  });

  // Create invoice for John (overdue)
  const johnsInvoice = await prisma.feeInvoice.create({
      data: {
          studentId: student1.id,
          feeStructureId: tuitionFee.id,
          academicYearId: academicYear2425.id,
          amount: 2500,
          dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
          status: 'OVERDUE'
      }
  });
  // Create invoice for Alice (paid)
  const alicesInvoice = await prisma.feeInvoice.create({
      data: {
          studentId: student2.id,
          feeStructureId: tuitionFee.id,
          academicYearId: academicYear2425.id,
          amount: 2500,
          dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
          status: 'PAID'
      }
  });
  // Create bus fee invoice for Alice (pending)
  await prisma.feeInvoice.create({
      data: {
          studentId: student2.id,
          feeStructureId: busFee.id,
          academicYearId: academicYear2425.id,
          amount: 300,
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // In 15 days
          status: 'PENDING'
      }
  });

  await prisma.feePayment.create({
    data: {
        invoiceId: alicesInvoice.id,
        amount: 2250, // Paid with 10% concession
        paymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        method: 'BANK_TRANSFER',
        status: 'COMPLETED',
        reference: 'TRN-SEED-PAID',
        schoolId: school1.id
    }
  });

  await prisma.feePayment.create({
    data: {
        invoiceId: johnsInvoice.id,
        amount: 500, // Partial payment
        paymentDate: new Date(),
        method: 'BANK_TRANSFER',
        status: 'PENDING',
        reference: 'TRN-SEED-PENDING',
        schoolId: school1.id
    }
  });

  console.log('Finished creating fee structures, invoices, and payments.');

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
