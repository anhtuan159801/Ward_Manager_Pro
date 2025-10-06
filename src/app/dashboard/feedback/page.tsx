import { FeedbackClient } from '@/components/feedback-client';
import { getFeedbacks } from '@/lib/data';

export default async function FeedbackPage() {
  const feedbacks = await getFeedbacks();

  return <FeedbackClient feedbacks={feedbacks} />;
}
