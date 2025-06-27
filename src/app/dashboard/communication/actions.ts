
"use server";

import { revalidatePath } from "next/cache";
import { getCommunicationRecommendations, CommunicationRecommendationsInput, CommunicationRecommendationsOutput } from "@/ai/flows/parent-teacher-communication-recommendations";
import { createCommunication, getFirstTeacher, getFirstSchool } from "@/lib/data";

export async function getRecommendationsAction(data: CommunicationRecommendationsInput): Promise<CommunicationRecommendationsOutput | { error: string }> {
  try {
    const result = await getCommunicationRecommendations(data);
    return result;
  } catch (e: any) {
    console.error(e);
    return { error: e.message || "Failed to get recommendations." };
  }
}

type SendMessageData = {
    studentId: string;
    receiverId: string;
    subject: string;
    message: string;
};

export async function sendCommunicationAction(data: SendMessageData) {
    try {
        const school = await getFirstSchool();
        if (!school) throw new Error("School not found");
        
        // In a real app, the sender ID would come from the logged-in user session.
        const teacher = await getFirstTeacher(school.id);
        if (!teacher) throw new Error("No teacher found to send communication.");

        await createCommunication(
            school.id,
            teacher.userId,
            data.receiverId,
            data.studentId,
            data.subject,
            data.message
        );
        
        revalidatePath("/dashboard/communication/history");
        return { success: true, message: "Message sent successfully." };
    } catch (error: any) {
        console.error("Failed to send message:", error);
        return { success: false, error: "Failed to send message." };
    }
}
