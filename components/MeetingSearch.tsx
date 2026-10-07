'use client';

import { useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function MeetingSearch() {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  function applySearch(term: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`);
  }

  const handleSearch = useDebouncedCallback(applySearch, 300);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleSearch.cancel();
    applySearch(inputRef.current?.value ?? '');
  }

  return (
    <form className="archive-search" role="search" onSubmit={submitSearch}>
      <label className="archive-search-field">
        <span className="sr-only">Search meetings</span>
        <svg
          aria-hidden="true"
          className="archive-search-icon"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 4.2 4.2" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          aria-label="Search meetings"
          placeholder="Search by speaker, leader, or meeting type..."
          defaultValue={searchParams.get('query')?.toString()}
          onChange={(event) => handleSearch(event.target.value)}
        />
      </label>
      <button type="submit" className="archive-search-button">
        Search
      </button>
    </form>
  );
}
