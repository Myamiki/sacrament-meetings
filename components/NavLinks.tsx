'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4">
      <Link
        href="/"
        className={pathname === '/' ? 'font-bold underline' : ''}
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
      >
        Meetings
      </Link>
    </nav>
  );
}