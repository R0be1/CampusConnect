
"use server";

import { revalidatePath } from "next/cache";
import { getFirstSchool, createStaffUser, updateUserRole, deleteUserAndStaff } from "@/lib/data";
import { z } from "zod";
import { promises as fs } from 'fs';
import path from 'path';

const permissionsFilePath = path.join(process.cwd(), 'src', 'lib', 'permissions.json');

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

export async function getRolePermissionsAction(): Promise<Record<string, Record<string, string[]>> | null> {
    try {
        const fileContent = await fs.readFile(permissionsFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Failed to read permissions file:", error);
        return null;
    }
}

export async function updateRolePermissionsAction(roleName: string, permissions: Record<string, string[]>) {
     try {
        const allPermissions = await getRolePermissionsAction();
        if (!allPermissions) {
            throw new Error("Could not load permissions file.");
        }
        allPermissions[roleName] = permissions;
        await fs.writeFile(permissionsFilePath, JSON.stringify(allPermissions, null, 2));
        revalidatePath('/dashboard/settings/users');
        return { success: true, message: "Permissions updated successfully." };
    } catch (error: any) {
        console.error("Failed to write permissions file:", error);
        return { success: false, error: "Failed to update permissions." };
    }
}
