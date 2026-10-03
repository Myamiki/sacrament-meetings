import Link from 'next/link';

export default function EditMeetingNotFound() {
  return (
    <section className="mx-auto max-w-3xl">
      <h2 className="text-2xl font-bold">Meeting not found</h2>
      <p className="mt-2">The meeting you are trying to edit does not exist.</p>
      <Link href="/meetings" className="mt-4 inline-block underline">
        Back to meetings
      </Link>
    </section>
  );
}
