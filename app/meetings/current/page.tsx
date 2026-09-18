import { getMeetings } from '@/lib/meetings-db';
import { redirect } from 'next/navigation';

function getMostRecentSunday() {
  const sunday = new Date();
  sunday.setDate(sunday.getDate() - sunday.getDay());
  return sunday.toISOString().slice(0, 10);
}

export default function CurrentMeetingPage() {
  const [meeting] = getMeetings(getMostRecentSunday());
  redirect(meeting ? `/meetings/${meeting.id}` : '/meetings');
}