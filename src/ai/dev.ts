import { config } from 'dotenv';
config();

import '@/ai/flows/generate-draft-content.ts';
import '@/ai/flows/summarize-feedback.ts';
import '@/ai/flows/generate-propaganda.ts';