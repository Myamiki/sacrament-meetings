import { neon } from '@neondatabase/serverless';
import type { SacramentMeeting } from './types';

const sql = neon(process.env.DATABASE_URL!);

const MEETINGS_PER_PAGE = 5;

async function withDatabaseErrorHandling<T>(
  operation: string,
  query: () => Promise<T>
): Promise<T> {
  try {
    return await query();
  } catch (error) {
    console.error(`Failed to ${operation}:`, error);
    throw new Error(`Unable to ${operation}. Please try again.`);
  }
}

export async function getMeetings(
  query: string = '',
  currentPage: number = 1
): Promise<SacramentMeeting[]> {
  return withDatabaseErrorHandling('load meetings', async () => {
    const offset = (currentPage - 1) * MEETINGS_PER_PAGE;
    const search = query.trim();
    const searchPattern = `%${search}%`;

    return await sql`
      SELECT
        id,
        date::text AS date,
        "meetingType",
        presiding,
        conducting,
        "openingHymn",
        "openingPrayer",
        "wardBusiness",
        "stakeBusiness",
        "sacramentHymn",
        speakers,
        "closingHymn",
        "closingPrayer",
        announcements
      FROM meetings
      WHERE
        ${search} = ''
        OR presiding ILIKE ${searchPattern}
        OR conducting ILIKE ${searchPattern}
        OR "meetingType"::text ILIKE ${searchPattern}
        OR speakers::text ILIKE ${searchPattern}
      ORDER BY date DESC
      LIMIT ${MEETINGS_PER_PAGE}
      OFFSET ${offset}
    ` as SacramentMeeting[];
  });
}

export async function getMeetingsTotalPages(
  query?: string | null
): Promise<number> {
  return withDatabaseErrorHandling('count meetings', async () => {
    const search = query?.trim() ?? '';

    if (search) {
      const searchPattern = `%${search}%`;

      const result = await sql`
        SELECT COUNT(*)::int AS count
        FROM meetings
        WHERE
          presiding ILIKE ${searchPattern}
          OR conducting ILIKE ${searchPattern}
          OR "meetingType"::text ILIKE ${searchPattern}
          OR speakers::text ILIKE ${searchPattern}
      `;

      return Math.ceil(result[0].count / MEETINGS_PER_PAGE);
    }

    const result = await sql`
      SELECT COUNT(*)::int AS count
      FROM meetings
    `;

    return Math.ceil(result[0].count / MEETINGS_PER_PAGE);
  });
}

export async function getMeetingById(
  id: number
): Promise<SacramentMeeting | null> {
  return withDatabaseErrorHandling('load meeting', async () => {
    const result = await sql`
      SELECT
        id,
        date::text AS date,
        "meetingType",
        presiding,
        conducting,
        "openingHymn",
        "openingPrayer",
        "wardBusiness",
        "stakeBusiness",
        "sacramentHymn",
        speakers,
        "closingHymn",
        "closingPrayer",
        announcements
      FROM meetings
      WHERE id = ${id}
    ` as SacramentMeeting[];

    return result[0] ?? null;
  });
}

export async function getMeetingsByDate(
  date: string
): Promise<SacramentMeeting[]> {
  return withDatabaseErrorHandling('load meetings by date', async () => (
    await sql`
      SELECT
        id,
        date::text AS date,
        "meetingType",
        presiding,
        conducting,
        "openingHymn",
        "openingPrayer",
        "wardBusiness",
        "stakeBusiness",
        "sacramentHymn",
        speakers,
        "closingHymn",
        "closingPrayer",
        announcements
      FROM meetings
      WHERE date = ${date}
      ORDER BY date DESC
    ` as SacramentMeeting[]
  ));
}

function stringifyJson(value: object): string {
  const result = JSON.stringify(value);

  if (result === undefined) {
    throw new Error('Meeting data could not be serialized.');
  }

  return result;
}

export async function addMeeting(
  meeting: Omit<SacramentMeeting, 'id'>
): Promise<SacramentMeeting> {
  let result: SacramentMeeting[];

  try {
    const [, insertedMeetings] = await sql.transaction((transaction) => [
      transaction`LOCK TABLE meetings IN EXCLUSIVE MODE`,
      transaction`
        INSERT INTO meetings (
          id,
          date,
          "meetingType",
          presiding,
          conducting,
          "openingHymn",
          "openingPrayer",
          "wardBusiness",
          "stakeBusiness",
          "sacramentHymn",
          speakers,
          "closingHymn",
          "closingPrayer",
          announcements
        )
        SELECT
          COALESCE(MAX(id), 0) + 1,
          ${meeting.date}::date,
          ${meeting.meetingType},
          ${meeting.presiding},
          ${meeting.conducting},
          ${stringifyJson(meeting.openingHymn)}::jsonb,
          ${meeting.openingPrayer},
          ${stringifyJson(meeting.wardBusiness)}::jsonb,
          ${meeting.stakeBusiness},
          ${stringifyJson(meeting.sacramentHymn)}::jsonb,
          ${stringifyJson(meeting.speakers)}::jsonb,
          ${stringifyJson(meeting.closingHymn)}::jsonb,
          ${meeting.closingPrayer},
          ${stringifyJson(meeting.announcements ?? [])}::jsonb
        FROM meetings
        RETURNING
          id,
          date::text AS date,
          "meetingType",
          presiding,
          conducting,
          "openingHymn",
          "openingPrayer",
          "wardBusiness",
          "stakeBusiness",
          "sacramentHymn",
          speakers,
          "closingHymn",
          "closingPrayer",
          announcements
      `,
    ]);
    result = insertedMeetings as SacramentMeeting[];
  } catch (error) {
    console.error('Failed to add meeting:', error);
    throw new Error('Unable to create the meeting. Please try again.');
  }

  if (!result[0]) {
    throw new Error('Unable to create the meeting. Please try again.');
  }

  return result[0];
}

export async function updateMeeting(
  id: number,
  meeting: Omit<SacramentMeeting, 'id'>
): Promise<SacramentMeeting> {
  let result: SacramentMeeting[];

  try {
    result = await sql`
      UPDATE meetings
      SET
        date = ${meeting.date}::date,
        "meetingType" = ${meeting.meetingType},
        presiding = ${meeting.presiding},
        conducting = ${meeting.conducting},
        "openingHymn" = ${stringifyJson(meeting.openingHymn)}::jsonb,
        "openingPrayer" = ${meeting.openingPrayer},
        "wardBusiness" = ${stringifyJson(meeting.wardBusiness)}::jsonb,
        "stakeBusiness" = ${meeting.stakeBusiness},
        "sacramentHymn" = ${stringifyJson(meeting.sacramentHymn)}::jsonb,
        speakers = ${stringifyJson(meeting.speakers)}::jsonb,
        "closingHymn" = ${stringifyJson(meeting.closingHymn)}::jsonb,
        "closingPrayer" = ${meeting.closingPrayer},
        announcements = ${stringifyJson(meeting.announcements ?? [])}::jsonb
      WHERE id = ${id}
      RETURNING
        id,
        date::text AS date,
        "meetingType",
        presiding,
        conducting,
        "openingHymn",
        "openingPrayer",
        "wardBusiness",
        "stakeBusiness",
        "sacramentHymn",
        speakers,
        "closingHymn",
        "closingPrayer",
        announcements
    ` as SacramentMeeting[];
  } catch (error) {
    console.error('Failed to update meeting:', error);
    throw new Error('Unable to update the meeting. Please try again.');
  }

  if (!result[0]) {
    throw new Error('Meeting not found.');
  }

  return result[0];
}

export async function deleteMeeting(id: number): Promise<void> {
  let result: { id: number }[];

  try {
    result = await sql`
      DELETE FROM meetings
      WHERE id = ${id}
      RETURNING id
    ` as { id: number }[];
  } catch (error) {
    console.error('Failed to delete meeting:', error);
    throw new Error('Unable to delete the meeting. Please try again.');
  }

  if (!result[0]) {
    throw new Error('Meeting not found.');
  }
}