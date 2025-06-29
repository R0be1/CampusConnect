
"use server";

import { revalidatePath } from "next/cache";
import { getFirstSchool, createGrade, createSection, deleteGrade, deleteSection } from "@/lib/data";

type NameFormValues = {
  name: string;
};

export async function addGradeAction(data: NameFormValues) {
    const school = await getFirstSchool();
    if (!school) return { success: false, error: "No school found." };
    try {
        const newGrade = await createGrade(data.name, school.id);
        revalidatePath('/dashboard/settings/grades-sections');
        return { success: true, newGrade };
    } catch (e: any) {
        if (e.code === 'P2002') {
            return { success: false, error: "This grade already exists." };
        }
        return { success: false, error: "Failed to create grade." };
    }
}

export async function deleteGradeAction(id: string) {
    try {
        await deleteGrade(id);
        revalidatePath('/dashboard/settings/grades-sections');
        return { success: true };
    } catch (e) {
        return { success: false, error: "Failed to delete grade. It may be in use." };
    }
}

export async function addSectionAction(data: { name: string, gradeId: string }) {
    const school = await getFirstSchool();
    if (!school) return { success: false, error: "No school found." };
    try {
        const newSection = await createSection(data.name, data.gradeId, school.id);
        revalidatePath('/dashboard/settings/grades-sections');
        return { success: true, newSection };
    } catch (e: any) {
        if (e.code === 'P2002') {
            return { success: false, error: "This section already exists for this grade." };
        }
        return { success: false, error: "Failed to create section." };
    }
}

export async function deleteSectionAction(id: string) {
    try {
        await deleteSection(id);
        revalidatePath('/dashboard/settings/grades-sections');
        return { success: true };
    } catch (e) {
        return { success: false, error: "Failed to delete section. It may be in use." };
    }
}
