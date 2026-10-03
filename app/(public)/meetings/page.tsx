import Link from 'next/link';
import MeetingCard from '@/components/MeetingCard';
import MeetingSearch from '@/components/MeetingSearch';
import Pagination from '@/components/Pagination';
import { getMeetings } from '@/lib/meetings-db';
import { getMeetingsTotalPages } from '@/lib/meetings-db';

export default async function MeetingsPage(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query ?? '';
  const currentPage = Number(searchParams?.page) || 1;

  const [meetings, totalPages] = await Promise.all([
    getMeetings(query, currentPage),
    getMeetingsTotalPages(query),
  ]);

  return (
    <section aria-labelledby="meetings-heading">
      <p className="eyebrow">Program archive</p>
      <h2 id="meetings-heading" className="mt-2 text-4xl font-bold tracking-tight">
        Sunday meetings
      </h2>
      <p className="mt-3 max-w-2xl text-slate-600">
        Review current and past programs, then open any meeting for a print-ready agenda.
      </p>

      <Link href="/meetings/new" className="button-primary mt-5">
        Create a meeting
      </Link>

      <MeetingSearch />

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {meetings.map((meeting) => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))}
      </div>

      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </section>
  );
}
