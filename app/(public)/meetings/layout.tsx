import Link from 'next/link';
import NavLinks from '@/components/NavLinks';

export default function MeetingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="mb-8 border-b pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">
            Meetings
          </h1>

          <NavLinks />
        </div>

        <div className="mt-4">
          <Link
            href="/meetings/current"
            className="text-sm underline"
          >
            View Current Sunday Meeting
          </Link>
        </div>
      </div>

      {children}
    </div>
  );
}