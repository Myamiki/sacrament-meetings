'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import {
  addMeeting,
  deleteMeeting as deleteMeetingRecord,
  updateMeeting as updateMeetingRecord,
} from './meetings-db';
import {
  MeetingFormSchema,
  type MeetingFormState,
  type MeetingFormValues,
  type ValidatedMeetingForm,
} from './meeting-schema';
import type { SacramentMeeting } from './types';

function getFieldErrors(
  error: z.ZodError,
): MeetingFormState['fieldErrors'] {
  const fieldErrors: NonNullable<MeetingFormState['fieldErrors']> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field === 'string' && field in MeetingFormSchema.shape) {
      const key = field as keyof MeetingFormValues;
      fieldErrors[key] ??= [];
      fieldErrors[key]?.push(issue.message);
    }
  }

  return fieldErrors;
}

function toMeeting(form: ValidatedMeetingForm): Omit<SacramentMeeting, 'id'> {
  return {
    date: form.date,
    meetingType: form.meetingType,
    presiding: form.presiding,
    conducting: form.conducting,
    announcements: form.announcements,
    openingHymn: {
      number: form.openingHymnNumber,
      title: form.openingHymnTitle,
    },
    openingPrayer: form.openingPrayer,
    wardBusiness: form.wardBusiness.map((description) => ({ description })),
    stakeBusiness: form.stakeBusiness,
    sacramentHymn: {
      number: form.sacramentHymnNumber,
      title: form.sacramentHymnTitle,
    },
    speakers: form.speakers,
    closingHymn: {
      number: form.closingHymnNumber,
      title: form.closingHymnTitle,
    },
    closingPrayer: form.closingPrayer,
  };
}

function getFormValues(formData: FormData): MeetingFormValues {
  const submitted = Object.fromEntries(formData.entries());
  const field = (name: string) => {
    const value = submitted[name];
    return typeof value === 'string' ? value : '';
  };
  const meetingType = field('meetingType');
  const stakeBusiness = field('stakeBusiness');

  return {
    date: field('date'),
    meetingType:
      meetingType === 'testimony' || meetingType === 'stake' || meetingType === 'general'
        ? meetingType
        : 'regular',
    presiding: field('presiding'),
    conducting: field('conducting'),
    announcements: field('announcements'),
    openingHymnNumber: field('openingHymnNumber'),
    openingHymnTitle: field('openingHymnTitle'),
    openingPrayer: field('openingPrayer'),
    wardBusiness: field('wardBusiness'),
    stakeBusiness: stakeBusiness === 'true' ? 'true' : 'false',
    sacramentHymnNumber: field('sacramentHymnNumber'),
    sacramentHymnTitle: field('sacramentHymnTitle'),
    speakers: field('speakers'),
    closingHymnNumber: field('closingHymnNumber'),
    closingHymnTitle: field('closingHymnTitle'),
    closingPrayer: field('closingPrayer'),
  };
}

function validateMeetingForm(formData: FormData) {
  const submitted = Object.fromEntries(formData.entries());
  const result = MeetingFormSchema.safeParse(submitted);

  if (!result.success) {
    return {
      success: false as const,
      state: {
        message: 'Please correct the highlighted fields.',
        fieldErrors: getFieldErrors(result.error),
        values: getFormValues(formData),
      },
    };
  }

  return { success: true as const, meeting: toMeeting(result.data) };
}

export async function createMeeting(
  _previousState: MeetingFormState,
  formData: FormData,
): Promise<MeetingFormState> {
  const validation = validateMeetingForm(formData);

  if (!validation.success) {
    return validation.state;
  }

  let meeting: SacramentMeeting;

  try {
    meeting = await addMeeting(validation.meeting);
  } catch {
    return {
      message: 'Unable to create the meeting. Please try again.',
      values: getFormValues(formData),
    };
  }

  revalidatePath('/meetings');
  redirect(`/meetings/${meeting.id}`);
}

export async function updateMeeting(
  id: number,
  _previousState: MeetingFormState,
  formData: FormData,
): Promise<MeetingFormState> {
  if (!Number.isSafeInteger(id) || id < 1) {
    return { message: 'This meeting could not be found.' };
  }

  const validation = validateMeetingForm(formData);

  if (!validation.success) {
    return validation.state;
  }

  let meeting: SacramentMeeting;

  try {
    meeting = await updateMeetingRecord(id, validation.meeting);
  } catch {
    return {
      message: 'Unable to update the meeting. Please try again.',
      values: getFormValues(formData),
    };
  }

  revalidatePath('/meetings');
  revalidatePath(`/meetings/${id}`);
  redirect(`/meetings/${meeting.id}`);
}

const meetingIdSchema = z.coerce.number().int().positive();

export async function deleteMeeting(formData: FormData): Promise<void> {
  const result = meetingIdSchema.safeParse(formData.get('meetingId'));

  if (!result.success) {
    throw new Error('A valid meeting ID is required to delete a meeting.');
  }

  try {
    await deleteMeetingRecord(result.data);
  } catch {
    throw new Error('Unable to delete the meeting. Please try again.');
  }

  revalidatePath('/meetings');
  redirect('/meetings');
}
