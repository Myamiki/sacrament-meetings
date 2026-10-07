import { auth } from '@/auth';
import { getMeetings, getMeetingsByDate } from '@/lib/meetings-db';

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const date = new URL(request.url).searchParams.get('date');

  const meetings = date
    ? await getMeetingsByDate(date)
    : await getMeetings('', 1);

  return Response.json(meetings);
}
