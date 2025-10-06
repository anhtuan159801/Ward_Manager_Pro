'use server';

import { summarizeFeedback } from '@/ai/flows/summarize-feedback';
import { suggestFeedbackSolution, type SuggestFeedbackSolutionInput } from '@/ai/flows/suggest-feedback-solution';
import { getFeedbacks } from '@/lib/data'; // Import getFeedbacks

export async function getFeedbackSummary(): Promise<{ summary: string } | { error: string }> {
  try {
    const feedbacks = await getFeedbacks(); // Fetch feedbacks from Supabase
    const allFeedbackText = feedbacks.map(fb => `From ${fb.author}: ${fb.content}`).join('\n\n');
    
    if (!allFeedbackText) {
      return { summary: "Không có phản ánh nào để tóm tắt." };
    }

    const result = await summarizeFeedback({ feedbackText: allFeedbackText });
    return { summary: result.summary };
  } catch (e) {
    console.error(e);
    return { error: 'Không thể tạo tóm tắt. Vui lòng thử lại.' };
  }
}


export async function getSolutionSuggestion(input: SuggestFeedbackSolutionInput): Promise<{ suggestion: string } | { error: string }> {
  try {
    const result = await suggestFeedbackSolution(input);
    return { suggestion: result.suggestion };
  } catch (e) {
    console.error(e);
    return { error: 'Không thể tạo đề xuất. Vui lòng thử lại.' };
  }
}
