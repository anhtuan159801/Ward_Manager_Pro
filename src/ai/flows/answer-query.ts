'use server';
/**
 * @fileOverview A general purpose AI assistant that can answer questions about system data.
 *
 * - answerQuery - A function that handles the query answering process.
 * - AnswerQueryInput - The input type for the answerQuery function.
 * - AnswerQueryOutput - The return type for the answerQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { mockResidents, mockEvents, mockFeedbacks } from '@/lib/data';

// Define tools for the AI to use
const getResidentsTool = ai.defineTool(
  {
    name: 'getResidents',
    description: 'Lấy danh sách tất cả cư dân trong hệ thống. Dữ liệu này bao gồm ngày sinh (dob) để có thể tính tuổi.',
    outputSchema: z.any(),
  },
  async () => {
    return mockResidents;
  }
);

const getEventsTool = ai.defineTool(
  {
    name: 'getEvents',
    description: 'Lấy danh sách tất cả các sự kiện đã và đang được lên kế hoạch.',
    outputSchema: z.any(),
  },
  async () => {
    return mockEvents;
  }
);

const getFeedbackTool = ai.defineTool(
  {
    name: 'getFeedback',
    description: 'Lấy danh sách tất cả các phản ánh của người dân.',
    outputSchema: z.any(),
  },
  async () => {
    return mockFeedbacks;
  }
);


const AnswerQueryInputSchema = z.object({
  query: z.string().describe('Câu hỏi của người dùng.'),
});
export type AnswerQueryInput = z.infer<typeof AnswerQueryInputSchema>;

const AnswerQueryOutputSchema = z.object({
  answer: z.string().describe('Câu trả lời của AI cho câu hỏi, bằng tiếng Việt.'),
});
export type AnswerQueryOutput = z.infer<typeof AnswerQueryOutputSchema>;

export async function answerQuery(input: AnswerQueryInput): Promise<AnswerQueryOutput> {
  return answerQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQueryPrompt',
  input: {schema: AnswerQueryInputSchema},
  output: {schema: AnswerQueryOutputSchema},
  tools: [getResidentsTool, getEventsTool, getFeedbackTool],
  prompt: `Bạn là một trợ lý AI thông minh cho tổ trưởng khu phố. Nhiệm vụ của bạn là trả lời các câu hỏi của tổ trưởng dựa trên dữ liệu có sẵn trong hệ thống.
  Sử dụng các công cụ được cung cấp để truy xuất thông tin cần thiết.

  Các định nghĩa nhóm tuổi trong hệ thống:
  - Thiếu nhi: Dưới 15 tuổi
  - Vị thành niên: Từ 15 đến 17 tuổi
  - Thanh niên: Từ 18 đến 35 tuổi
  - Độ tuổi nghĩa vụ quân sự: Từ 18 đến 27 tuổi
  - Người cao tuổi: Từ 60 tuổi trở lên

  Hãy trả lời một cách ngắn gọn, chính xác và chuyên nghiệp bằng tiếng Việt.
  Dựa vào thông tin bạn có, hãy trả lời câu hỏi sau: "{{{query}}}"
  `,
});

const answerQueryFlow = ai.defineFlow(
  {
    name: 'answerQueryFlow',
    inputSchema: AnswerQueryInputSchema,
    outputSchema: AnswerQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
