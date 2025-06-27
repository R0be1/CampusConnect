
"use server";

import { updateSchoolProfile } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function updateSchoolProfileAction(schoolId: string, formData: FormData) {
    const data = {
        name: formData.get('name') as string,
        accountName: formData.get('accountName') as string,
        branch: formData.get('branch') as string,
        contactPerson: formData.get('contactPerson') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        logoUrl: formData.get('logoUrl') as string,
    };

    try {
        await updateSchoolProfile(schoolId, data);
        revalidatePath('/dashboard/settings/school-profile', 'layout');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update school profile." };
    }
}
