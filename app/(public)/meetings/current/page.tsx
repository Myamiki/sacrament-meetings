import { getMeetingsByDate } from '@/lib/meetings-db';
import { redirect } from 'next/navigation';

function getMostRecentSunday() {
  const sunday = new Date();
  sunday.setDate(sunday.getDate() - sunday.getDay());
  return sunday.toISOString().slice(0, 10);
}

export default async function CurrentMeetingPage() {
  const [meeting] = await getMeetingsByDate(getMostRecentSunday());
  redirect(meeting ? `/meetings/${meeting.id}` : '/meetings');
}
