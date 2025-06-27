"use server";

import { revalidatePath } from "next/cache";
import { createLiveSession } from "@/lib/data";

export async function scheduleSessionAction(data: any, schoolId: string, teacherId: string) {
    try {
        await createLiveSession(data, schoolId, teacherId);
        revalidatePath('/dashboard/live-sessions');
        return { success: true, message: `Session "${data.topic}" has been scheduled.` };
    } catch (error) {
        console.error("Failed to schedule session:", error);
        return { success: false, error: "Failed to schedule the session." };
    }
}
