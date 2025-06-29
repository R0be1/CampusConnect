
"use server";

import { revalidatePath } from "next/cache";
import { createLiveSession } from "@/lib/data";
import * as store from '@/lib/live-session-store';

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

// --- Real-time Session Actions ---

export async function getSessionStateAction(sessionId: string) {
    return store.getSessionState(sessionId);
}

export async function joinSessionAction(sessionId: string, studentId: string, studentName: string) {
    return store.joinSession(sessionId, studentId, studentName);
}

export async function leaveSessionAction(sessionId: string, studentId: string) {
    return store.leaveSession(sessionId, studentId);
}

export async function toggleHandAction(sessionId: string, studentId: string, raised: boolean) {
    return store.toggleHand(sessionId, studentId, raised);
}

export async function sendMessageAction(sessionId: string, from: string, text: string) {
    return store.addMessage(sessionId, from, text);
}

export async function setTeacherCameraStateAction(sessionId: string, isOn: boolean) {
    return store.setCameraState(sessionId, isOn);
}

export async function setTeacherScreenStateAction(sessionId: string, isOn: boolean) {
    return store.setScreenState(sessionId, isOn);
}
