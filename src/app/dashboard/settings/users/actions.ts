"use server";

import { revalidatePath } from "next/cache";
import { getFirstSchool, createStaffUser, updateUserRole, deleteUserAndStaff } from "@/lib/data";
import { z } from "zod";

const userSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().min(10, "A valid phone number is required"),
    role: z.string().min(1, "A role must be selected"),
});

export async function createUserAction(formData: unknown) {
    const validatedFields = userSchema.safeParse(formData);
    if (!validatedFields.success) {
        return { success: false, error: "Invalid data provided." };
    }

    const school = await getFirstSchool();
    if (!school) return { success: false, error: "No school found." };

    try {
        await createStaffUser(validatedFields.data, school.id);
        revalidatePath('/dashboard/settings/users');
        return { success: true, message: "User created successfully." };
    } catch (e: any) {
        if (e.code === 'P2002') {
            return { success: false, error: "A user with this phone number already exists." };
        }
        return { success: false, error: e.message || "Failed to create user." };
    }
}

export async function updateUserRoleAction(userId: string, staffId: string, newRole: string) {
    try {
        await updateUserRole(userId, staffId, newRole);
        revalidatePath('/dashboard/settings/users');
        return { success: true, message: "User role updated." };
    } catch (e: any) {
        return { success: false, error: "Failed to update role." };
    }
}

export async function deleteUserAction(userId: string) {
    try {
        await deleteUserAndStaff(userId);
        revalidatePath('/dashboard/settings/users');
        return { success: true, message: "User deleted." };
    } catch (e: any) {
        return { success: false, error: "Failed to delete user." };
    }
}
