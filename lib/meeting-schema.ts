import { z } from 'zod';
import type { SpeakerItem } from './types';

const meetingTypes = ['testimony', 'regular', 'stake', 'general'] as const;

const hymnNumber = z
  .string()
  .trim()
  .regex(/^\d+$/, 'Enter a positive hymn number.')
  .transform(Number)
  .pipe(z.number().int().positive('Enter a positive hymn number.'));

const date = z.string().trim().refine((value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime())
    && parsed.toISOString().slice(0, 10) === value;
}, 'Enter a valid meeting date.');

const lines = z.string().transform((value) =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
);

const speakers = z.string().transform((value, context) => {
  const result: SpeakerItem[] = [];
  const entries = value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  for (const [index, entry] of entries.entries()) {
    const [name, topic, type, ...extra] = entry.split('|').map((part) => part.trim());

    if (
      !name
      || extra.length > 0
      || (type !== 'speaker' && type !== 'musical-number')
    ) {
      context.addIssue({
        code: 'custom',
        path: ['speakers'],
        message: `Line ${index + 1}: use Name | topic | speaker or musical-number.`,
      });
      return z.NEVER;
    }

    result.push({
      name,
      topic: topic ?? '',
      type,
    });
  }

  return result;
});

export const MeetingFormSchema = z.object({
  date,
  meetingType: z.enum(meetingTypes),
  presiding: z.string().trim().min(1, 'Enter who is presiding.'),
  conducting: z.string().trim().min(1, 'Enter who is conducting.'),
  announcements: lines,
  openingHymnNumber: hymnNumber,
  openingHymnTitle: z.string().trim().min(1, 'Enter the opening hymn title.'),
  openingPrayer: z.string().trim().min(1, 'Enter who will offer the opening prayer.'),
  wardBusiness: lines,
  stakeBusiness: z.enum(['true', 'false']).transform((value) => value === 'true'),
  sacramentHymnNumber: hymnNumber,
  sacramentHymnTitle: z.string().trim().min(1, 'Enter the sacrament hymn title.'),
  speakers,
  closingHymnNumber: hymnNumber,
  closingHymnTitle: z.string().trim().min(1, 'Enter the closing hymn title.'),
  closingPrayer: z.string().trim().min(1, 'Enter who will offer the closing prayer.'),
});

export type MeetingFormValues = z.input<typeof MeetingFormSchema>;
export type ValidatedMeetingForm = z.output<typeof MeetingFormSchema>;

export type MeetingFormState = {
  message: string;
  fieldErrors?: Partial<Record<keyof MeetingFormValues, string[]>>;
  values?: MeetingFormValues;
};

export type MeetingFormAction = (
  previousState: MeetingFormState,
  formData: FormData,
) => Promise<MeetingFormState>;
