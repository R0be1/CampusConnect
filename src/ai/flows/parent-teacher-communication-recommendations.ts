// use server'

/**
 * @fileOverview AI-powered tool that recommends optimal parent-teacher communication strategies based on student performance and behavioral data.
 *
 * - getCommunicationRecommendations - A function that handles the communication recommendations process.
 * - CommunicationRecommendationsInput - The input type for the getCommunicationRecommendations function.
 * - CommunicationRecommendationsOutput - The return type for the getCommunicationRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CommunicationRecommendationsInputSchema = z.object({
  studentPerformanceData: z.string().describe('Student performance data including grades, scores, and attendance records.'),
  studentBehavioralData: z.string().describe('Student behavioral data including any disciplinary actions or notes from teachers.'),
  communicationHistory: z.string().describe('A summary of previous communication between parents and teachers.'),
});
export type CommunicationRecommendationsInput = z.infer<typeof CommunicationRecommendationsInputSchema>;

const CommunicationRecommendationsOutputSchema = z.object({
  communicationStrategy: z.string().describe('Recommended communication strategy based on the student data.'),
  communicationFrequency: z.string().describe('Recommended frequency of communication with the parents (e.g., weekly, monthly).'),
  communicationMethods: z.array(z.string()).describe('Recommended communication methods (e.g., email, phone call, in-person meeting).'),
  talkingPoints: z.array(z.string()).describe('Suggested talking points for the teacher to discuss with the parents.'),
});
export type CommunicationRecommendationsOutput = z.infer<typeof CommunicationRecommendationsOutputSchema>;

export async function getCommunicationRecommendations(input: CommunicationRecommendationsInput): Promise<CommunicationRecommendationsOutput> {
  return communicationRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'communicationRecommendationsPrompt',
  input: {schema: CommunicationRecommendationsInputSchema},
  output: {schema: CommunicationRecommendationsOutputSchema},
  prompt: `You are an AI assistant designed to analyze student data and recommend optimal parent-teacher communication strategies.

  Based on the following student data, provide a communication strategy, recommended frequency, methods, and talking points for the teacher to use when communicating with the parents.

  Student Performance Data: {{{studentPerformanceData}}}
  Student Behavioral Data: {{{studentBehavioralData}}}
  Communication History: {{{communicationHistory}}}

  Follow the schema provided, and make sure your answer is a valid JSON.
`,
});

const communicationRecommendationsFlow = ai.defineFlow(
  {
    name: 'communicationRecommendationsFlow',
    inputSchema: CommunicationRecommendationsInputSchema,
    outputSchema: CommunicationRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
