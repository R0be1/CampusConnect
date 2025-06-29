
"use server";

import { revalidatePath } from "next/cache";
import { createStudentWithParent, updateStudentWithParent, deleteStudent } from "@/lib/data";
import { StudentRegistrationFormValues } from "./student-form";

export async function registerStudentAction(data: StudentRegistrationFormValues, schoolId: string) {
  try {
    const result = await createStudentWithParent(data, schoolId);
    revalidatePath("/dashboard/students/list");
    return { success: true, message: `Successfully registered ${result.student.firstName}.` };
  } catch (error: any) {
    console.error("Failed to register student:", error);
    return { success: false, message: "Failed to register student. Please try again." };
  }
}

export async function updateStudentAction(studentId: string, data: StudentRegistrationFormValues) {
    try {
        const result = await updateStudentWithParent(studentId, data);
        revalidatePath("/dashboard/students/list");
        revalidatePath(`/dashboard/students/${studentId}`);
        return { success: true, message: `Successfully updated ${result?.firstName}.`, updatedStudent: result };
    } catch (error: any) {
        console.error("Failed to update student:", error);
        return { success: false, message: "Failed to update student. Please try again." };
    }
}

export async function deleteStudentAction(studentId: string) {
    try {
        await deleteStudent(studentId);
        revalidatePath("/dashboard/students/list");
        return { success: true, message: "Student deleted successfully." };
    } catch (error: any) {
        console.error("Failed to delete student:", error);
        return { success: false, message: "Failed to delete student. They may have dependent records." };
    }
}
