
"use server";

import { createAcademicYear, deleteAcademicYear, getFirstSchool, setCurrentAcademicYear } from "@/lib/data";
import { revalidatePath } from "next/cache";

type YearFormValues = {
    name: string;
}

export async function addAcademicYearAction(data: YearFormValues) {
    const school = await getFirstSchool();
    if (!school) {
        return { success: false, error: "No school found." };
    }
    try {
        const newYear = await createAcademicYear(data.name, school.id);
        revalidatePath('/dashboard/settings/academic-year');
        return { success: true, newYear };
    } catch (e: any) {
        if (e.code === 'P2002') {
            return { success: false, error: "This academic year already exists." };
        }
        return { success: false, error: "Failed to create academic year." };
    }
}

export async function setCurrentAcademicYearAction(id: string) {
    const school = await getFirstSchool();
    if (!school) {
        return { success: false, error: "No school found." };
    }
    try {
        await setCurrentAcademicYear(id, school.id);
        revalidatePath('/dashboard/settings/academic-year');
        return { success: true };
    } catch (e) {
        return { success: false, error: "Failed to set current academic year." };
    }
}

export async function deleteAcademicYearAction(id: string) {
    try {
        await deleteAcademicYear(id);
        revalidatePath('/dashboard/settings/academic-year');
        return { success: true };
    } catch (e) {
        return { success: false, error: "Failed to delete academic year. It might be in use." };
    }
}
