'use client';

import Link from 'next/link';

interface MeetingsErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function MeetingsError({
  error,
  retry: reset,
}: MeetingsErrorProps) {
  return (
    <section className="mx-auto max-w-3xl" aria-labelledby="meetings-error-heading">
      <h2 id="meetings-error-heading" className="text-2xl font-bold">
        Something went wrong
      </h2>
      <p className="mt-2">{error.message || 'Unable to load this meeting page.'}</p>
      <div className="mt-4 flex gap-4">
        <button type="button" onClick={() => reset()} className="button-primary">
          Try Again
        </button>
        <Link href="/meetings" className="button-secondary">
          Back to meetings
        </Link>
      </div>
    </section>
  );
}
