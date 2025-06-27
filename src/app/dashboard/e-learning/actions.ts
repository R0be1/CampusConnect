
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createLearningMaterialAction(data: any, schoolId: string, uploaderId: string) {
    try {
        // In a real app, you would handle file upload here and get a URL.
        // For now, we'll just store a placeholder.
        const url = "/placeholder.pdf";

        await prisma.learningMaterial.create({
            data: {
                title: data.title,
                description: data.description,
                subject: data.subject,
                gradeId: data.gradeId,
                type: data.type,
                url: url,
                schoolId: schoolId,
                uploaderId: uploaderId,
            }
        });
        revalidatePath("/dashboard/e-learning/manage");
        return { success: true, message: `Material "${data.title}" has been published.` };
    } catch (error: any) {
        console.error("Failed to create learning material:", error);
        return { success: false, error: "Failed to create material." };
    }
}

export async function updateLearningMaterialAction(materialId: string, data: any) {
    try {
        await prisma.learningMaterial.update({
            where: { id: materialId },
            data: {
                title: data.title,
                description: data.description,
                subject: data.subject,
                gradeId: data.gradeId,
            }
        });
        revalidatePath("/dashboard/e-learning/manage");
        return { success: true, message: "Material updated successfully." };
    } catch (error: any) {
        console.error("Failed to update learning material:", error);
        return { success: false, error: "Failed to update material." };
    }
}

export async function deleteLearningMaterialAction(materialId: string) {
    try {
        await prisma.learningMaterial.delete({
            where: { id: materialId },
        });
        revalidatePath("/dashboard/e-learning/manage");
        return { success: true, message: "Material deleted successfully." };
    } catch (error: any) {
        console.error("Failed to delete learning material:", error);
        return { success: false, error: "Failed to delete material." };
    }
}
