import type { Metadata } from 'next';
import Link from 'next/link';
import MeetingCard from '@/components/MeetingCard';
import MeetingSearch from '@/components/MeetingSearch';
import Pagination from '@/components/Pagination';
import { getMeetings, getMeetingsTotalPages } from '@/lib/meetings-db';

export const metadata: Metadata = {
  title: 'Meeting Archive | Sacrament Meeting Planner',
  description: 'Browse and review past sacrament meeting programs in the Sacrament Meeting Planner.',
};

export default async function MeetingsPage(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query ?? '';
  const requestedPage = Number(searchParams?.page);

  const [totalPages] = await Promise.all([
    getMeetingsTotalPages(query),
  ]);
  const currentPage = Number.isSafeInteger(requestedPage) && requestedPage > 0
    ? Math.min(requestedPage, Math.max(totalPages, 1))
    : 1;
  const meetings = await getMeetings(query, currentPage);

  return (
    <section aria-labelledby="meetings-heading">
      <p className="eyebrow">Program archive</p>
      <h2 id="meetings-heading" className="mt-2 text-4xl font-bold tracking-tight">
        Sunday meetings
      </h2>
      <p className="mt-3 max-w-2xl text-slate-600">
        Review current and past programs, then open any meeting for a print-ready agenda.
      </p>

      <div className="archive-toolbar">
        <Link href="/meetings/new" className="button-primary archive-create-button">
          Create a meeting
        </Link>
        <MeetingSearch />
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {meetings.map((meeting) => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))}
      </div>

      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </section>
  );
}
