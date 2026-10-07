'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/actions';

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-5 rounded-lg border bg-white p-6 shadow-sm">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          minLength={6}
          required
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
      </div>

      {errorMessage && (
        <p role="alert" className="text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="button-primary w-full disabled:opacity-60"
      >
        {isPending ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
