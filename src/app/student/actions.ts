"use server";

import { getAttendanceForStudentPortal } from "@/lib/data";

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
