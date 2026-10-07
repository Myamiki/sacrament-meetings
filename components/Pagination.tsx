'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export default function Pagination({
  totalPages,
  currentPage,
}: PaginationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <nav aria-label="Pagination" className="archive-pagination">
      <button
        type="button"
        aria-label="Previous page"
        className="archive-page-button"
        disabled={currentPage <= 1}
        onClick={() => goToPage(Math.max(1, currentPage - 1))}
      >
        <span aria-hidden="true">&larr;</span>
        Previous
      </button>
      <span className="archive-page-count">
        Page {currentPage} of {totalPages}
      </span>
      <button
        type="button"
        aria-label="Next page"
        className="archive-page-button"
        disabled={currentPage >= totalPages}
        onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
      >
        Next
        <span aria-hidden="true">&rarr;</span>
      </button>
    </nav>
  );
}
