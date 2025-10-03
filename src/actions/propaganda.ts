'use server';

import { generatePropaganda, type GeneratePropagandaInput } from '@/ai/flows/generate-propaganda';
import { z } from 'zod';

const formSchema = z.object({
  topic: z.string().min(5, { message: 'Chủ đề phải có ít nhất 5 ký tự.' }),
  tone: z.string().min(3, { message: 'Giọng điệu phải có ít nhất 3 ký tự.' }),
  targetAudience: z.string().min(3, { message: 'Đối tượng phải có ít nhất 3 ký tự.' }),
  desiredOutcome: z.string().min(10, { message: 'Kết quả mong muốn phải có ít nhất 10 ký tự.' }),
  additionalContext: z.string().optional(),
});

export async function generatePropagandaAction(values: z.infer<typeof formSchema>): Promise<{ message: string } | { error: string }> {
  const validatedFields = formSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Dữ liệu không hợp lệ.' };
  }

  try {
    const result = await generatePropaganda(validatedFields.data as GeneratePropagandaInput);
    return { message: result.message };
  } catch (e) {
    console.error(e);
    return { error: 'Không thể tạo nội dung. Vui lòng thử lại.' };
  }
}
