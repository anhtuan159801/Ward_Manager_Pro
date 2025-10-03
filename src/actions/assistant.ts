'use server';

import { answerQuery, type AnswerQueryInput } from '@/ai/flows/answer-query';
import { z } from 'zod';

const formSchema = z.object({
  query: z.string().min(5, { message: 'Câu hỏi phải có ít nhất 5 ký tự.' }),
});

export async function answerSystemQuery(values: z.infer<typeof formSchema>): Promise<{ answer: string } | { error: string }> {
  const validatedFields = formSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Câu hỏi không hợp lệ.' };
  }

  try {
    const result = await answerQuery(validatedFields.data as AnswerQueryInput);
    return { answer: result.answer };
  } catch (e) {
    console.error(e);
    return { error: 'Không thể tạo câu trả lời. Vui lòng thử lại.' };
  }
}
