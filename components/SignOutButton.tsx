import { signOutAction } from '@/lib/actions';

export default function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button type="submit" className="text-sm underline">
        Sign Out
      </button>
    </form>
  );
}
