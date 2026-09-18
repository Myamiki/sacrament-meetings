'use client';

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="button-secondary print-hidden"
    >
      Print program
    </button>
  );
}
