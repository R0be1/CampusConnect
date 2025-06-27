"use server";

import { revalidatePath } from "next/cache";
import { getStudentsForAttendance, getAttendanceForDate, upsertAttendance, getAttendanceSummary, getFirstTeacher, getFirstSchool } from "@/lib/data";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

export type AttendanceState = {
  [studentId: string]: {
    status: AttendanceStatus;
    notes: string;
  };
};

export async function getClassRosterAction(gradeId: string, sectionId: string, date: Date) {
    try {
        if (!gradeId || !sectionId || !date) {
            return { success: false, error: "Missing required parameters." };
        }
        
        const students = await getStudentsForAttendance(gradeId, sectionId);
        const attendanceRecords = await getAttendanceForDate(gradeId, sectionId, date);

        const roster = students.map(s => ({
            id: s.id,
            name: `${s.user.firstName} ${s.user.lastName}`,
        }));

        const attendance: AttendanceState = {};
        for (const record of attendanceRecords) {
            attendance[record.studentId] = { status: record.status, notes: record.notes ?? '' };
        }

        return { success: true, roster, attendance };
    } catch (error) {
        console.error("Failed to fetch class roster:", error);
        return { success: false, error: "Failed to fetch class roster." };
    }
}

export async function saveAttendanceAction(
  attendanceData: AttendanceState,
  date: Date
) {
    try {
        const school = await getFirstSchool();
        if (!school) throw new Error("School not found");
        // For demonstration, we'll use the first teacher found. In a real app, this would be the logged-in user.
        const teacher = await getFirstTeacher(school.id);
        if (!teacher) throw new Error("No teacher found to mark attendance.");
        
        const dataToSave = Object.entries(attendanceData).map(([studentId, record]) => ({
            studentId,
            status: record.status,
            notes: record.notes,
        }));
        
        await upsertAttendance(dataToSave, date, teacher.id);
        revalidatePath("/dashboard/attendance/records");
        return { success: true, message: "Attendance saved successfully." };
    } catch (error: any) {
        console.error("Failed to save attendance:", error);
        return { success: false, error: error.message || "Failed to save attendance." };
    }
}

export async function getAttendanceSummaryAction(gradeId: string, sectionId: string, month: number, year: number) {
     try {
        if (!gradeId || !sectionId || !month || !year) {
            return { success: false, error: "Missing required parameters." };
        }
        const summary = await getAttendanceSummary(gradeId, sectionId, month, year);
        return { success: true, summary };
    } catch (error) {
        console.error("Failed to fetch attendance summary:", error);
        return { success: false, error: "Failed to fetch attendance summary." };
    }
}
