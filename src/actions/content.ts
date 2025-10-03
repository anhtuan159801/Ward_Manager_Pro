'use server';

import { generateDraftContent, type GenerateDraftContentInput } from '@/ai/flows/generate-draft-content';
import { z } from 'zod';

const formSchema = z.object({
  contentType: z.enum(['announcement', 'report', 'invitation']),
  topic: z.string().min(5, { message: 'Chủ đề phải có ít nhất 5 ký tự.' }),
  targetAudience: z.string().min(3, { message: 'Đối tượng phải có ít nhất 3 ký tự.' }),
  additionalContext: z.string().optional(),
});

export async function generateContentAction(values: z.infer<typeof formSchema>): Promise<{ draftContent: string } | { error: string }> {
  const validatedFields = formSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Dữ liệu không hợp lệ.' };
  }

  try {
    const result = await generateDraftContent(validatedFields.data as GenerateDraftContentInput);
    return { draftContent: result.draftContent };
  } catch (e) {
    console.error(e);
    return { error: 'Không thể tạo nội dung. Vui lòng thử lại.' };
  }
}
