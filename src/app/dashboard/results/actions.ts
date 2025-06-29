
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Exam Actions
export async function createExamAction(data: any, schoolId: string, academicYearId: string) {
    try {
        await prisma.exam.create({
            data: { 
                ...data, 
                schoolId, 
                academicYearId, 
                weightage: parseFloat(data.weightage),
                totalMarks: parseFloat(data.totalMarks)
            }
        });
        revalidatePath('/dashboard/results/manage-exams');
        return { success: true, message: "Exam created successfully." };
    } catch (e: any) {
        console.error(e);
        return { success: false, error: "Failed to create exam." };
    }
}

export async function updateExamAction(examId: string, data: any) {
    try {
        await prisma.exam.update({
            where: { id: examId },
            data: { 
                ...data, 
                weightage: parseFloat(data.weightage),
                totalMarks: parseFloat(data.totalMarks)
            }
        });
        revalidatePath('/dashboard/results/manage-exams');
        return { success: true, message: "Exam updated successfully." };
    } catch (e: any) {
        console.error(e);
        return { success: false, error: "Failed to update exam." };
    }
}

export async function deleteExamAction(examId: string) {
    try {
        await prisma.exam.delete({ where: { id: examId } });
        revalidatePath('/dashboard/results/manage-exams');
        return { success: true, message: "Exam deleted successfully." };
    } catch (e: any) {
        console.error(e);
        return { success: false, error: "Failed to delete exam." };
    }
}

// Result Actions
async function getStudentsForExam(examId: string) {
    const exam = await prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) return [];
    return prisma.student.findMany({
        where: { gradeId: exam.gradeId, sectionId: exam.sectionId },
        include: { user: true },
        orderBy: { user: { firstName: 'asc' } },
    });
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
                name: `${student.user.firstName} ${student.user.lastName}`,
                score: result?.score || '',
                status: result?.status || 'PENDING'
            };
        });
        return { success: true, data, gradingType: exam?.gradingType };
    } catch (e: any) {
        console.error(e);
        return { success: false, error: "Failed to fetch results." };
    }
}

export async function submitResultsForApprovalAction(examId: string, results: {studentId: string, score: string, status: string}[]) {
    try {
        await prisma.$transaction(async (tx) => {
            for (const result of results) {
                if (!result.score) continue; // Skip empty scores

                let newStatus: any = result.status;
                if (result.status === 'PENDING') newStatus = 'PENDING_APPROVAL';
                if (result.status === 'APPROVED') newStatus = 'PENDING_REAPPROVAL';

                if (newStatus !== result.status) {
                    await tx.examResult.upsert({
                        where: { examId_studentId: { examId, studentId: result.studentId } },
                        update: { score: result.score, status: newStatus },
                        create: { examId, studentId: result.studentId, score: result.score, status: 'PENDING_APPROVAL' },
                    });
                }
            }
        });
        revalidatePath('/dashboard/results/enter-results');
        revalidatePath('/dashboard/results/approve-results');
        return { success: true, message: "Results submitted for approval." };
    } catch (e: any) {
        console.error(e);
        return { success: false, error: "Failed to submit results." };
    }
}


export async function getApprovalsForExamAction(examId: string) {
     try {
        const results = await prisma.examResult.findMany({
            where: { examId, status: { in: ['PENDING_APPROVAL', 'PENDING_REAPPROVAL'] } },
            include: { student: { include: { user: true } } }
        });
         const data = results.map(r => ({
            id: r.id, // The result ID, not student ID
            studentId: r.studentId,
            name: `${r.student.user.firstName} ${r.student.user.lastName}`,
            score: r.score,
            status: r.status,
         }));
        return { success: true, data };
    } catch (e: any) {
        console.error(e);
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
        } else { // reject
            newStatus = result.status === 'PENDING_REAPPROVAL' ? 'APPROVED' : 'PENDING';
        }

        await prisma.examResult.update({
            where: { id: resultId },
            data: { status: newStatus }
        });
        
        revalidatePath('/dashboard/results/approve-results');
        return { success: true };
    } catch (e: any) {
        console.error(e);
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
        console.error(e);
        return { success: false, error: "Failed to bulk update." };
    }
}
