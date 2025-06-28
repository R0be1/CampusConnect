
"use server";

import { getAttendanceForStudentPortal, getTestsForStudentPortal, getTestDetailsForStudent, submitTestForStudent, getTestResultForStudent } from "@/lib/data";

export async function getStudentAttendanceAction(studentId: string, month: number, year: number) {
    try {
        if (!studentId) {
            return { success: false, error: "Student not found." };
        }
        const data = await getAttendanceForStudentPortal(studentId, month, year);
        return { success: true, data };
    } catch (error: any) {
        console.error("Failed to get attendance data:", error);
        return { success: false, error: "Failed to fetch attendance data." };
    }
}
export type StudentPortalAttendanceData = Awaited<ReturnType<typeof getAttendanceForStudentPortal>>;

export async function getTestsAction(studentId: string) {
    try {
        if (!studentId) return { success: false, error: "Student ID is required." };
        const data = await getTestsForStudentPortal(studentId);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch tests." };
    }
}
export type StudentPortalTestsData = Awaited<ReturnType<typeof getTestsForStudentPortal>>;

export async function getTestDetailsAction(testId: string, studentId: string) {
    try {
        if (!studentId) return { success: false, error: "Student ID is required." };
        const data = await getTestDetailsForStudent(testId, studentId);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch test details." };
    }
}
export type StudentPortalTestDetailsData = NonNullable<Awaited<ReturnType<typeof getTestDetailsForStudent>>>;


export async function submitTestAction(testId: string, studentId: string, answers: { questionId: string, answer: string }[]) {
     try {
        if (!studentId) return { success: false, error: "Student ID is required." };
        const submission = await submitTestForStudent(testId, studentId, answers);
        return { success: true, submissionId: submission.id };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to submit test." };
    }
}

export async function getTestResultAction(testId: string, studentId: string) {
    try {
        if (!studentId) return { success: false, error: "Student ID is required." };
        const data = await getTestResultForStudent(testId, studentId);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch test results." };
    }
}
export type StudentPortalTestResultData = Awaited<ReturnType<typeof getTestResultForStudent>>;
