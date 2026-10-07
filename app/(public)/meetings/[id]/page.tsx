import MeetingDetail from '@/components/MeetingDetail';
import { getAdjacentMeetings, getMeetingById } from '@/lib/meetings-db';
import { notFound } from 'next/navigation';

interface MeetingPageProps {
  params: Promise<{ id: string }>;
}

export default async function MeetingPage({ params }: MeetingPageProps) {
  const { id } = await params;
  const meeting = await getMeetingById(Number(id));

  if (!meeting) {
    notFound();
  }

  const { previousMeeting, nextMeeting } = await getAdjacentMeetings(meeting.date);

  return (
    <MeetingDetail
      meeting={meeting}
      previousMeeting={previousMeeting}
      nextMeeting={nextMeeting}
    />
  );
}
