import Link from 'next/link';
import MeetingForm from '@/components/MeetingForm';
import { createMeeting } from '@/lib/actions';

export default function NewMeetingPage() {
  return (
    <section className="mx-auto max-w-3xl">
      <p className="eyebrow">Admin</p>
      <h2 className="mt-2 text-3xl font-bold">Create a meeting</h2>
      <MeetingForm action={createMeeting} submitLabel="Create meeting" />
      <Link href="/meetings" className="mt-6 inline-block underline">
        Back to meetings
      </Link>
    </section>
  );
}
