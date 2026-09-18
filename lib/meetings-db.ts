import type { SacramentMeeting } from './types';

const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: '2026-05-03',
    meetingType: 'regular',
    presiding: 'Bishop Smith',
    conducting: 'Brother Jones',
    openingHymn: { number: 2, title: 'The Spirit of God' },
    openingPrayer: 'Sister Williams',
    wardBusiness: [{ description: 'Sustaining of new Primary president' }],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: "In Remembrance of Thy Suffering" },
    speakers: [
      { name: 'Sister Brown', topic: 'Faith in Jesus Christ', type: 'speaker' },
      { name: 'Youth Choir', topic: '', type: 'musical-number' }
    ],
    closingHymn: { number: 31, title: 'O God, Our Help in Ages Past' },
    closingPrayer: 'Brother Davis',
    announcements: ['Ward temple night: May 10'],
  },
  {
    id: 2,
    date: '2026-05-10',
    meetingType: 'testimony',
    presiding: 'Bishop Smith',
    conducting: 'Sister Garcia',
    announcements: ['Youth conference registration is open.'],
    openingHymn: { number: 85, title: 'How Firm a Foundation' },
    openingPrayer: 'Brother Lee',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 185, title: 'Reverently and Meekly Now' },
    speakers: [],
    closingHymn: { number: 223, title: 'Have I Done Any Good?' },
    closingPrayer: 'Sister Patel',
  },
  {
    id: 3,
    date: '2026-05-17',
    meetingType: 'regular',
    presiding: 'President Carter',
    conducting: 'Brother Jones',
    openingHymn: { number: 94, title: 'Come, Ye Thankful People' },
    openingPrayer: 'Sister Williams',
    wardBusiness: [{ description: 'Sustaining of new Sunday School teacher' }],
    stakeBusiness: true,
    sacramentHymn: { number: 174, title: 'While of These Emblems We Partake' },
    speakers: [
      { name: 'Elder Kim', topic: 'Covenant belonging', type: 'speaker' },
      { name: 'Sister Nguyen', topic: 'Service at home', type: 'speaker' },
    ],
    closingHymn: { number: 219, title: 'Because I Have Been Given Much' },
    closingPrayer: 'Brother Davis',
  },
  {
    id: 4,
    date: '2026-05-24',
    meetingType: 'stake',
    presiding: 'President Carter',
    conducting: 'Sister Garcia',
    announcements: ['Stake broadcast begins at 6:00 p.m.'],
    openingHymn: { number: 81, title: 'Press Forward, Saints' },
    openingPrayer: 'Brother Lee',
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 169, title: 'In Remembrance of Thy Suffering' },
    speakers: [{ name: 'President Carter', topic: 'Faith in the Lord', type: 'speaker' }],
    closingHymn: { number: 270, title: "I'll Go Where You Want Me to Go" },
    closingPrayer: 'Sister Patel',
  },
  {
    id: 5,
    date: '2026-05-31',
    meetingType: 'general',
    presiding: 'Bishop Smith',
    conducting: 'Brother Jones',
    openingHymn: { number: 227, title: 'There Is Sunshine in My Soul Today' },
    openingPrayer: 'Sister Williams',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 193, title: 'I Stand All Amazed' },
    speakers: [{ name: 'Ward Choir', topic: '', type: 'musical-number' }],
    closingHymn: { number: 152, title: 'God Be with You Till We Meet Again' },
    closingPrayer: 'Brother Davis',
  },
];

export function getMeetings(date?: string | null): SacramentMeeting[] {
  if (date) return meetings.filter((meeting) => meeting.date === date);
  return meetings;
}

export function getMeetingById(id: number): SacramentMeeting | null {
  return meetings.find(m => m.id === id) ?? null;
}