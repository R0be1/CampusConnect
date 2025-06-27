// src/app/dashboard/students/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { createStudentWithParent } from "@/lib/data";
import { StudentRegistrationFormValues } from "./student-form";

export async function registerStudentAction(data: StudentRegistrationFormValues, schoolId: string) {
  try {
    const result = await createStudentWithParent(data, schoolId);
    revalidatePath("/dashboard/students/list");
    return { success: true, message: `Successfully registered ${result.student.firstName}.` };
  } catch (error: any) {
    console.error("Failed to register student:", error);
    if (error.code === 'P2002' && error.meta?.target?.includes('phone')) {
        return { success: false, message: "A user with this parent phone number already exists." };
    }
    return { success: false, message: "Failed to register student. Please try again." };
  }
}
