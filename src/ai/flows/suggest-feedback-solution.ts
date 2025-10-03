'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating solution suggestions for community feedback.
 *
 * It exports:
 * - `suggestFeedbackSolution`: An async function to generate a solution.
 * - `SuggestFeedbackSolutionInput`: The input type for `suggestFeedbackSolution`.
 * - `SuggestFeedbackSolutionOutput`: The output type for `suggestFeedbackSolution`.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFeedbackSolutionInputSchema = z.object({
  feedbackContent: z.string().describe('The content of the feedback to be resolved.'),
});
export type SuggestFeedbackSolutionInput = z.infer<typeof SuggestFeedbackSolutionInputSchema>;

const SuggestFeedbackSolutionOutputSchema = z.object({
  suggestion: z.string().describe('The AI-generated suggestion to resolve the feedback, formatted as a bulleted list.'),
});
export type SuggestFeedbackSolutionOutput = z.infer<typeof SuggestFeedbackSolutionOutputSchema>;

export async function suggestFeedbackSolution(input: SuggestFeedbackSolutionInput): Promise<SuggestFeedbackSolutionOutput> {
  return suggestFeedbackSolutionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFeedbackSolutionPrompt',
  input: {schema: SuggestFeedbackSolutionInputSchema},
  output: {schema: SuggestFeedbackSolutionOutputSchema},
  prompt: `You are an experienced and empathetic ward leader assistant. Your output must be in Vietnamese.
  Your task is to provide a clear, actionable, and helpful suggestion to address the following feedback from a resident.
  The suggestion should be practical and aim to resolve the issue effectively.

  Feedback from resident:
  "{{{feedbackContent}}}"

  Based on this feedback, provide a step-by-step suggestion on how to handle it. Format the suggestion as a bulleted list (using '- ' for each point, with each point on a new line).
  `,
});

const suggestFeedbackSolutionFlow = ai.defineFlow(
  {
    name: 'suggestFeedbackSolutionFlow',
    inputSchema: SuggestFeedbackSolutionInputSchema,
    outputSchema: SuggestFeedbackSolutionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
