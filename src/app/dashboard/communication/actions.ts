"use server";

import { getCommunicationRecommendations, CommunicationRecommendationsInput, CommunicationRecommendationsOutput } from "@/ai/flows/parent-teacher-communication-recommendations";

export async function getRecommendationsAction(data: CommunicationRecommendationsInput): Promise<CommunicationRecommendationsOutput | { error: string }> {
  try {
    const result = await getCommunicationRecommendations(data);
    return result;
  } catch (e: any) {
    console.error(e);
    return { error: e.message || "Failed to get recommendations." };
  }
}
