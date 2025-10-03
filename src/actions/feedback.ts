'use server';

import { summarizeFeedback } from '@/ai/flows/summarize-feedback';
import { mockFeedbacks } from '@/lib/data';

export async function getFeedbackSummary(): Promise<{ summary: string } | { error: string }> {
  try {
    const allFeedbackText = mockFeedbacks.map(fb => `From ${fb.author}: ${fb.content}`).join('\n\n');
    
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
