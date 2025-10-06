'use server';
/**
 * @fileOverview A propaganda generation AI agent.
 *
 * - generatePropaganda - A function that handles the propaganda generation process.
 * - GeneratePropagandaInput - The input type for the generatePropaganda function.
 * - GeneratePropagandaOutput - The return type for the generatePropaganda function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getFeedbacks } from '@/lib/data';

const GeneratePropagandaInputSchema = z.object({
  topic: z.string().describe('The topic of the propaganda.'),
  tone: z.string().describe('The tone of the propaganda (e.g., motivational, informative, urgent).'),
  targetAudience: z.string().describe('The target audience for the propaganda (e.g., young adults, elderly residents, families).'),
  desiredOutcome: z.string().describe('The desired outcome of the propaganda (e.g., increased participation in community events, greater awareness of local issues, improved community relations).'),
  additionalContext: z.string().optional().describe('Any additional context or information to be included in the propaganda.'),
});
export type GeneratePropagandaInput = z.infer<typeof GeneratePropagandaInputSchema>;

const GeneratePropagandaOutputSchema = z.object({
  message: z.string().describe('The generated propaganda message.'),
});
export type GeneratePropagandaOutput = z.infer<typeof GeneratePropagandaOutputSchema>;

export async function generatePropaganda(input: GeneratePropagandaInput): Promise<GeneratePropagandaOutput> {
  return generatePropagandaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePropagandaPrompt',
  input: {schema: GeneratePropagandaInputSchema},
  output: {schema: GeneratePropagandaOutputSchema},
  prompt: `You are an AI assistant designed to generate effective propaganda and motivational messages for community engagement. Your output must be in Vietnamese.

  Topic: {{{topic}}}
  Tone: {{{tone}}}
  Target Audience: {{{targetAudience}}}
  Desired Outcome: {{{desiredOutcome}}}
  Additional Context: {{{additionalContext}}}

  Generate a propaganda message that is tailored to the target audience, employs the specified tone, and aims to achieve the desired outcome.
  The message should be well-formatted with newlines for readability.`,
});

const generatePropagandaFlow = ai.defineFlow(
  {
    name: 'generatePropagandaFlow',
    inputSchema: GeneratePropagandaInputSchema,
    outputSchema: GeneratePropagandaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
