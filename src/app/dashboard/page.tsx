import { DashboardClient } from '@/components/dashboard-client';
import { getResidents, getEvents, getFeedbacks } from '@/lib/data';

export default async function DashboardPage() {
  const residents = await getResidents();
  const events = await getEvents();
  const feedbacks = await getFeedbacks();

  return <DashboardClient residents={residents} events={events} feedbacks={feedbacks} />;
}
