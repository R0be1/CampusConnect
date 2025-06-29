
"use server";

import { revalidatePath } from "next/cache";
import { getFirstSchool, getCurrentAcademicYear, getStudentDashboardData, getAttendanceForStudentPortal, getTestsForStudentPortal, getTestDetailsForStudent, submitTestForStudent, getTestResultForStudent, getLearningMaterialsForPortal, getLiveSessionsForPortal, registerForLiveSession, getLiveSessionById } from "@/lib/data";
import type { StudentDashboardData } from "@/lib/data";

export async function getDashboardDataAction(studentId: string) {
  try {
    if (!studentId) {
        return { success: false, error: "Student ID is required." };
    }
    const school = await getFirstSchool();
    if (!school) throw new Error("School not found");
    
    const academicYear = await getCurrentAcademicYear(school.id);
    if (!academicYear) throw new Error("Current academic year not set");

    const data = await getStudentDashboardData(studentId, academicYear.id);
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to get dashboard data:", error);
    return { success: false, error: error.message || "Failed to fetch dashboard data." };
  }
}


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

export async function getELearningMaterialsAction(studentId: string) {
    try {
        if (!studentId) return { success: false, error: "Student ID is required." };
        const data = await getLearningMaterialsForPortal(studentId);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch e-learning materials." };
    }
}
export type StudentPortalELearningData = Awaited<ReturnType<typeof getLearningMaterialsForPortal>>;

export async function getLiveSessionsAction(studentId: string) {
    try {
        if (!studentId) return { success: false, error: "Student ID is required." };
        const data = await getLiveSessionsForPortal(studentId);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch live sessions." };
    }
}
export type StudentPortalLiveSessionsData = Awaited<ReturnType<typeof getLiveSessionsForPortal>>;

export async function registerForSessionAction(sessionId: string, studentId: string) {
    try {
        if (!studentId) return { success: false, error: "Student ID is required." };
        await registerForLiveSession(sessionId, studentId);
        revalidatePath('/student/live-sessions');
        return { success: true, message: "Successfully registered for the session!" };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to register for the session." };
    }
}

export async function getLiveSessionAction(sessionId: string) {
    try {
        if (!sessionId) return { success: false, error: "Session ID is required." };
        const data = await getLiveSessionById(sessionId);
        if (!data) return { success: false, error: "Session not found." };
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch live session." };
    }
}
