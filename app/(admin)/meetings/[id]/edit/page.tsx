import Link from 'next/link';
import MeetingForm from '@/components/MeetingForm';
import { updateMeeting } from '@/lib/actions';
import { getMeetingById } from '@/lib/meetings-db';
import { notFound } from 'next/navigation';

interface EditMeetingPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMeetingPage({ params }: EditMeetingPageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);

  if (!Number.isSafeInteger(id) || id < 1) {
    notFound();
  }

  const meeting = await getMeetingById(id);

  if (!meeting) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-3xl">
      <p className="eyebrow">Admin</p>
      <h2 className="mt-2 text-3xl font-bold">Edit meeting</h2>
      <MeetingForm
        action={updateMeeting.bind(null, meeting.id)}
        initialMeeting={meeting}
        submitLabel="Save changes"
      />
      <Link href={`/meetings/${meeting.id}`} className="mt-6 inline-block underline">
        Cancel and return to meeting
      </Link>
    </section>
  );
}
