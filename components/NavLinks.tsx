'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation" className="flex gap-4">
      <Link
        href="/"
        className={pathname === '/' ? 'font-bold underline' : ''}
        aria-current={pathname === '/' ? 'page' : undefined}
      >
        Home
      </Link>

      <Link
        href="/meetings"
        className={
          pathname.startsWith('/meetings')
            ? 'font-bold underline'
            : ''
        }
        aria-current={pathname.startsWith('/meetings') ? 'page' : undefined}
      >
        Meetings
      </Link>
    </nav>
  );
}