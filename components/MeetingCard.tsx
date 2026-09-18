import Link from 'next/link';
import type { SacramentMeeting } from '@/lib/types';

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  return (
    <article className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">
        {meeting.date}
      </h2>

      <p className="mt-2 capitalize">
        {meeting.meetingType} meeting
      </p>

      <p className="mt-2">
        <strong>Presiding:</strong> {meeting.presiding}
      </p>

      <p>
        <strong>Conducting:</strong> {meeting.conducting}
      </p>

      <Link
        href={`/meetings/${meeting.id}`}
        className="mt-4 inline-block rounded bg-black px-4 py-2 text-white"
      >
        View Meeting
      </Link>
    </article>
  );
}
