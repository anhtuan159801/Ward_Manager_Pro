'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating draft content (announcements, reports, invitations) using the Gemini API.
 *
 * It exports:
 * - `generateDraftContent`: An async function to generate draft content.
 * - `GenerateDraftContentInput`: The input type for `generateDraftContent`.
 * - `GenerateDraftContentOutput`: The output type for `generateDraftContent`.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDraftContentInputSchema = z.object({
  contentType: z
    .enum(['announcement', 'report', 'invitation'])
    .describe('The type of content to generate.'),
  topic: z.string().describe('The topic of the content.'),
  targetAudience: z.string().describe('The intended audience for the content.'),
  additionalContext: z
    .string()
    .optional()
    .describe('Any additional context or information to include.'),
});
export type GenerateDraftContentInput = z.infer<typeof GenerateDraftContentInputSchema>;

const GenerateDraftContentOutputSchema = z.object({
  draftContent: z.string().describe('The generated draft content.'),
});
export type GenerateDraftContentOutput = z.infer<typeof GenerateDraftContentOutputSchema>;

export async function generateDraftContent(input: GenerateDraftContentInput): Promise<GenerateDraftContentOutput> {
  return generateDraftContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDraftContentPrompt',
  input: {schema: GenerateDraftContentInputSchema},
  output: {schema: GenerateDraftContentOutputSchema},
  prompt: `You are an AI assistant helping a ward leader generate content. Your output must be in Vietnamese.

  You will generate a draft for the ward leader based on the provided information, based on content type. The content should be appropriate for the target audience.
  
  IMPORTANT: The output must be well-formatted. Use newlines (\n) to separate paragraphs, headings, and list items to ensure the content is easy to read.

  Content Type: {{{contentType}}}
  Topic: {{{topic}}}
  Target Audience: {{{targetAudience}}}
  Additional Context: {{{additionalContext}}}
  `,
});

const generateDraftContentFlow = ai.defineFlow(
  {
    name: 'generateDraftContentFlow',
    inputSchema: GenerateDraftContentInputSchema,
    outputSchema: GenerateDraftContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
