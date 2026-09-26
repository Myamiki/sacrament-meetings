import { neon } from '@neondatabase/serverless';
import type { SacramentMeeting } from './types';

const sql = neon(process.env.DATABASE_URL!);

const MEETINGS_PER_PAGE = 5;

export async function getMeetings(
  query: string = '',
  currentPage: number = 1
): Promise<SacramentMeeting[]> {
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
}

export async function getMeetingsTotalPages(
  query?: string | null
): Promise<number> {
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
}

export async function getMeetingById(
  id: number
): Promise<SacramentMeeting | null> {
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
}

export async function getMeetingsByDate(
  date: string
): Promise<SacramentMeeting[]> {
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
    WHERE date = ${date}
    ORDER BY date DESC
  ` as SacramentMeeting[];
}

export function addMeeting(
  _meeting: Omit<SacramentMeeting, 'id'>
): Promise<SacramentMeeting> {
  void _meeting;
  return Promise.reject(
    new Error('addMeeting will be implemented in Week 04.')
  );
}

export function updateMeeting(
  _id: number,
  _meeting: Partial<Omit<SacramentMeeting, 'id'>>
): Promise<SacramentMeeting> {
  void _id;
  void _meeting;
  return Promise.reject(
    new Error('updateMeeting will be implemented in Week 04.')
  );
}

export function deleteMeeting(_id: number): Promise<void> {
  void _id;
  return Promise.reject(
    new Error('deleteMeeting will be implemented in Week 04.')
  );
}