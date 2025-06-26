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
  subject: z.string().describe('A concise and professional subject line for the communication.'),
  messageBody: z.string().describe('A detailed message body drafted for the parent, incorporating the key talking points.'),
  communicationStrategy: z.string().describe('Recommended communication strategy based on the student data.'),
  communicationFrequency: z.string().describe('Recommended frequency of communication with the parents (e.g., weekly, monthly).'),
  communicationMethods: z.array(z.string()).describe('Recommended communication methods (e.g., email, phone call, in-person meeting).'),
});
export type CommunicationRecommendationsOutput = z.infer<typeof CommunicationRecommendationsOutputSchema>;

export async function getCommunicationRecommendations(input: CommunicationRecommendationsInput): Promise<CommunicationRecommendationsOutput> {
  return communicationRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'communicationRecommendationsPrompt',
  input: {schema: CommunicationRecommendationsInputSchema},
  output: {schema: CommunicationRecommendationsOutputSchema},
  prompt: `You are an AI assistant designed to help teachers draft professional and effective communications to parents.

  Based on the following student data, generate a communication draft. This includes a subject line and a full message body.
  Also provide a recommended communication strategy, frequency, and methods.

  Student Performance Data: {{{studentPerformanceData}}}
  Student Behavioral Data: {{{studentBehavioralData}}}
  Communication History: {{{communicationHistory}}}

  The tone should be professional, empathetic, and clear. The goal is to build a positive parent-teacher partnership.

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
