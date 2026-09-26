import { getMeetings, getMeetingsByDate } from '@/lib/meetings-db';

export async function GET(request: Request) {
  const date = new URL(request.url).searchParams.get('date');

  const meetings = date
    ? await getMeetingsByDate(date)
    : await getMeetings('', 1);

  return Response.json(meetings);
}
