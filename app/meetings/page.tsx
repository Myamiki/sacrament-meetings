import MeetingCard from '@/components/MeetingCard';
import { getMeetings } from '@/lib/meetings-db';

export default function MeetingsPage() {
  const meetings = getMeetings();

  return (
    <section aria-labelledby="meetings-heading">
      <p className="eyebrow">Program archive</p>
      <h2 id="meetings-heading" className="mt-2 text-4xl font-bold tracking-tight">
        Sunday meetings
      </h2>
      <p className="mt-3 max-w-2xl text-slate-600">
        Review current and past programs, then open any meeting for a print-ready agenda.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {meetings.map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} />)}
      </div>
    </section>
  );
}