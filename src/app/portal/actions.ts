
"use server";

import { getCurrentAcademicYear, getFirstSchool, getPortalDashboardData, getStudentsForParentPortal, getAcademicDataForStudentPortal, getAttendanceForStudentPortal } from "@/lib/data";

export async function getAvailableStudentsAction() {
    try {
        const students = await getStudentsForParentPortal();
        return { success: true, students };
    } catch (error: any) {
        console.error("Failed to fetch available students:", error);
        return { success: false, error: "Failed to fetch students." };
    }
}

export async function getDashboardDataAction(studentId: string) {
  try {
    if (!studentId) {
        return { success: false, error: "Student ID is required." };
    }
    const school = await getFirstSchool();
    if (!school) throw new Error("School not found");
    
    const academicYear = await getCurrentAcademicYear(school.id);
    if (!academicYear) throw new Error("Current academic year not set");

    const data = await getPortalDashboardData(studentId, academicYear.id);
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to get dashboard data:", error);
    return { success: false, error: error.message || "Failed to fetch dashboard data." };
  }
}

export async function getAcademicsAction(studentId: string) {
  try {
    if (!studentId) {
        return { success: false, error: "Student ID is required." };
    }
    const school = await getFirstSchool();
    if (!school) throw new Error("School not found");
    
    const academicYear = await getCurrentAcademicYear(school.id);
    if (!academicYear) throw new Error("Current academic year not set");

    const data = await getAcademicDataForStudentPortal(studentId, academicYear.id);
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to get academics data:", error);
    return { success: false, error: error.message || "Failed to fetch academics data." };
  }
}
export type PortalAcademicsData = Awaited<ReturnType<typeof getAcademicDataForStudentPortal>>;

export async function getAttendanceAction(studentId: string, month: number, year: number) {
    try {
        if (!studentId) {
            return { success: false, error: "Student ID is required." };
        }
        const data = await getAttendanceForStudentPortal(studentId, month, year);
        return { success: true, data };
    } catch (error: any) {
        console.error("Failed to get attendance data:", error);
        return { success: false, error: error.message || "Failed to fetch attendance data." };
    }
}
export type PortalAttendanceData = Awaited<ReturnType<typeof getAttendanceForStudentPortal>>;
