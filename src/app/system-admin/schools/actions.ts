
"use server";

import { revalidatePath } from "next/cache";
import { createSchool, updateSchool, deleteSchool } from "@/lib/data";
import type { School } from "@prisma/client";

export async function createSchoolAction(data: Omit<School, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
        await createSchool(data);
        revalidatePath('/system-admin/schools');
        return { success: true, message: `School "${data.name}" created successfully.` };
    } catch (error) {
        console.error("Failed to create school:", error);
        return { success: false, error: "Failed to create school." };
    }
}

export async function updateSchoolAction(schoolId: string, data: Partial<Omit<School, 'id' | 'createdAt' | 'updatedAt'>>) {
    try {
        await updateSchool(schoolId, data);
        revalidatePath('/system-admin/schools');
        revalidatePath(`/system-admin/schools/${schoolId}/edit`);
        return { success: true, message: `School "${data.name}" updated successfully.` };
    } catch (error) {
        console.error("Failed to update school:", error);
        return { success: false, error: "Failed to update school." };
    }
}

export async function deleteSchoolAction(schoolId: string) {
    try {
        await deleteSchool(schoolId);
        revalidatePath('/system-admin/schools');
        return { success: true, message: "School deleted successfully." };
    } catch (error) {
        console.error("Failed to delete school:", error);
        return { success: false, error: "Failed to delete school. It might have associated records." };
    }
}
