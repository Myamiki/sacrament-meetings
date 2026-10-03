'use client';

import { useActionState, useState } from 'react';
import type { SacramentMeeting } from '@/lib/types';
import type {
  MeetingFormAction,
  MeetingFormState,
  MeetingFormValues,
} from '@/lib/meeting-schema';

interface MeetingFormProps {
  action: MeetingFormAction;
  initialMeeting?: SacramentMeeting;
  submitLabel: string;
}

type EditableMeetingFormValues = {
  [Field in keyof MeetingFormValues]: string;
};

const emptyValues: EditableMeetingFormValues = {
  date: '',
  meetingType: 'regular',
  presiding: '',
  conducting: '',
  announcements: '',
  openingHymnNumber: '',
  openingHymnTitle: '',
  openingPrayer: '',
  wardBusiness: '',
  stakeBusiness: 'false',
  sacramentHymnNumber: '',
  sacramentHymnTitle: '',
  speakers: '',
  closingHymnNumber: '',
  closingHymnTitle: '',
  closingPrayer: '',
};

const initialState: MeetingFormState = { message: '' };

function getInitialValues(meeting?: SacramentMeeting): EditableMeetingFormValues {
  if (!meeting) {
    return emptyValues;
  }

  return {
    date: meeting.date,
    meetingType: meeting.meetingType,
    presiding: meeting.presiding,
    conducting: meeting.conducting,
    announcements: meeting.announcements?.join('\n') ?? '',
    openingHymnNumber: String(meeting.openingHymn.number),
    openingHymnTitle: meeting.openingHymn.title,
    openingPrayer: meeting.openingPrayer,
    wardBusiness: meeting.wardBusiness.map((item) => item.description).join('\n'),
    stakeBusiness: meeting.stakeBusiness ? 'true' : 'false',
    sacramentHymnNumber: String(meeting.sacramentHymn.number),
    sacramentHymnTitle: meeting.sacramentHymn.title,
    speakers: meeting.speakers
      .map((item) => `${item.name} | ${item.topic} | ${item.type}`)
      .join('\n'),
    closingHymnNumber: String(meeting.closingHymn.number),
    closingHymnTitle: meeting.closingHymn.title,
    closingPrayer: meeting.closingPrayer,
  };
}

function FieldMessage({
  name,
  state,
  hint,
}: {
  name: keyof MeetingFormValues;
  state: MeetingFormState;
  hint: string;
}) {
  return (
    <div className="mt-1 text-sm">
      <p id={`${name}-hint`} className="text-slate-600">{hint}</p>
      <p id={`${name}-error`} className="text-red-700">
        {state.fieldErrors?.[name]?.join(' ')}
      </p>
    </div>
  );
}

export default function MeetingForm({
  action,
  initialMeeting,
  submitLabel,
}: MeetingFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [values, setValues] = useState(() => getInitialValues(initialMeeting));

  function handleFieldChange(
    field: keyof EditableMeetingFormValues,
    value: string,
  ) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  }

  return (
    <form action={formAction} noValidate className="mt-6 space-y-8">
      <div
        id="form-errors"
        aria-live="polite"
        aria-atomic="true"
        className="text-sm font-medium text-red-700"
      >
        {state.message}
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Meeting information</h2>
        <div>
          <label htmlFor="meeting-date" className="font-medium">Date</label>
          <input
            id="meeting-date"
            name="date"
            type="date"
            required
            value={values.date}
            onChange={(event) => handleFieldChange('date', event.currentTarget.value)}
            aria-invalid={Boolean(state.fieldErrors?.date?.length)}
            aria-describedby="date-hint date-error"
            className="mt-1 block w-full rounded-md border p-2"
          />
          <FieldMessage name="date" state={state} hint="Choose the Sunday meeting date." />
        </div>

        <div>
          <label htmlFor="meeting-type" className="font-medium">Meeting type</label>
          <select
            id="meeting-type"
            name="meetingType"
            value={values.meetingType}
            onChange={(event) => handleFieldChange('meetingType', event.currentTarget.value)}
            aria-invalid={Boolean(state.fieldErrors?.meetingType?.length)}
            aria-describedby="meetingType-hint meetingType-error"
            className="mt-1 block w-full rounded-md border p-2"
          >
            <option value="regular">Regular</option>
            <option value="testimony">Testimony</option>
            <option value="stake">Stake</option>
            <option value="general">General</option>
          </select>
          <FieldMessage
            name="meetingType"
            state={state}
            hint="Select the type of meeting."
          />
        </div>

        <div>
          <label htmlFor="meeting-presiding" className="font-medium">Presiding</label>
          <input
            id="meeting-presiding"
            name="presiding"
            required
            value={values.presiding}
            onChange={(event) => handleFieldChange('presiding', event.currentTarget.value)}
            aria-invalid={Boolean(state.fieldErrors?.presiding?.length)}
            aria-describedby="presiding-hint presiding-error"
            className="mt-1 block w-full rounded-md border p-2"
          />
          <FieldMessage name="presiding" state={state} hint="Enter the presiding leader." />
        </div>

        <div>
          <label htmlFor="meeting-conducting" className="font-medium">Conducting</label>
          <input
            id="meeting-conducting"
            name="conducting"
            required
            value={values.conducting}
            onChange={(event) => handleFieldChange('conducting', event.currentTarget.value)}
            aria-invalid={Boolean(state.fieldErrors?.conducting?.length)}
            aria-describedby="conducting-hint conducting-error"
            className="mt-1 block w-full rounded-md border p-2"
          />
          <FieldMessage name="conducting" state={state} hint="Enter who will conduct the meeting." />
        </div>

        <div>
          <label htmlFor="meeting-announcements" className="font-medium">Announcements</label>
          <textarea
            id="meeting-announcements"
            name="announcements"
            rows={3}
            value={values.announcements}
            onChange={(event) => handleFieldChange('announcements', event.currentTarget.value)}
            aria-invalid={Boolean(state.fieldErrors?.announcements?.length)}
            aria-describedby="announcements-hint announcements-error"
            className="mt-1 block w-full rounded-md border p-2"
          />
          <FieldMessage
            name="announcements"
            state={state}
            hint="Enter one announcement per line. Leave blank if there are none."
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Opening</h2>
        <div>
          <label htmlFor="opening-hymn-number" className="font-medium">Opening hymn number</label>
          <input
            id="opening-hymn-number"
            name="openingHymnNumber"
            inputMode="numeric"
            required
            value={values.openingHymnNumber}
            onChange={(event) => handleFieldChange('openingHymnNumber', event.currentTarget.value)}
            aria-invalid={Boolean(state.fieldErrors?.openingHymnNumber?.length)}
            aria-describedby="openingHymnNumber-hint openingHymnNumber-error"
            className="mt-1 block w-full rounded-md border p-2"
          />
          <FieldMessage name="openingHymnNumber" state={state} hint="Enter a positive hymn number." />
        </div>
        <div>
          <label htmlFor="opening-hymn-title" className="font-medium">Opening hymn title</label>
          <input
            id="opening-hymn-title"
            name="openingHymnTitle"
            required
            value={values.openingHymnTitle}
            onChange={(event) => handleFieldChange('openingHymnTitle', event.currentTarget.value)}
            aria-invalid={Boolean(state.fieldErrors?.openingHymnTitle?.length)}
            aria-describedby="openingHymnTitle-hint openingHymnTitle-error"
            className="mt-1 block w-full rounded-md border p-2"
          />
          <FieldMessage name="openingHymnTitle" state={state} hint="Enter the hymn title." />
        </div>
        <div>
          <label htmlFor="opening-prayer" className="font-medium">Opening prayer</label>
          <input
            id="opening-prayer"
            name="openingPrayer"
            required
            value={values.openingPrayer}
            onChange={(event) => handleFieldChange('openingPrayer', event.currentTarget.value)}
            aria-invalid={Boolean(state.fieldErrors?.openingPrayer?.length)}
            aria-describedby="openingPrayer-hint openingPrayer-error"
            className="mt-1 block w-full rounded-md border p-2"
          />
          <FieldMessage name="openingPrayer" state={state} hint="Enter who will offer the prayer." />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Ward business</h2>
        <div>
          <label htmlFor="ward-business" className="font-medium">Ward business</label>
          <textarea
            id="ward-business"
            name="wardBusiness"
            rows={3}
            value={values.wardBusiness}
            onChange={(event) => handleFieldChange('wardBusiness', event.currentTarget.value)}
            aria-invalid={Boolean(state.fieldErrors?.wardBusiness?.length)}
            aria-describedby="wardBusiness-hint wardBusiness-error"
            className="mt-1 block w-full rounded-md border p-2"
          />
          <FieldMessage
            name="wardBusiness"
            state={state}
            hint="Enter one ward business item per line. Leave blank if there are none."
          />
        </div>
        <div>
          <label htmlFor="stake-business" className="font-medium">Stake business</label>
          <select
            id="stake-business"
            name="stakeBusiness"
            value={values.stakeBusiness}
            onChange={(event) => handleFieldChange('stakeBusiness', event.currentTarget.value)}
            aria-invalid={Boolean(state.fieldErrors?.stakeBusiness?.length)}
            aria-describedby="stakeBusiness-hint stakeBusiness-error"
            className="mt-1 block w-full rounded-md border p-2"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
          <FieldMessage
            name="stakeBusiness"
            state={state}
            hint="Choose whether stake business is included."
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">The sacrament</h2>
        <div>
          <label htmlFor="sacrament-hymn-number" className="font-medium">Sacrament hymn number</label>
          <input
            id="sacrament-hymn-number"
            name="sacramentHymnNumber"
            inputMode="numeric"
            required
            value={values.sacramentHymnNumber}
            onChange={(event) => handleFieldChange('sacramentHymnNumber', event.currentTarget.value)}
            aria-invalid={Boolean(state.fieldErrors?.sacramentHymnNumber?.length)}
            aria-describedby="sacramentHymnNumber-hint sacramentHymnNumber-error"
            className="mt-1 block w-full rounded-md border p-2"
          />
          <FieldMessage name="sacramentHymnNumber" state={state} hint="Enter a positive hymn number." />
        </div>
        <div>
          <label htmlFor="sacrament-hymn-title" className="font-medium">Sacrament hymn title</label>
          <input
            id="sacrament-hymn-title"
            name="sacramentHymnTitle"
            required
            value={values.sacramentHymnTitle}
            onChange={(event) => handleFieldChange('sacramentHymnTitle', event.currentTarget.value)}
            aria-invalid={Boolean(state.fieldErrors?.sacramentHymnTitle?.length)}
            aria-describedby="sacramentHymnTitle-hint sacramentHymnTitle-error"
            className="mt-1 block w-full rounded-md border p-2"
          />
          <FieldMessage name="sacramentHymnTitle" state={state} hint="Enter the hymn title." />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Messages and music</h2>
        <div>
          <label htmlFor="meeting-speakers" className="font-medium">Speakers and musical numbers</label>
          <textarea
            id="meeting-speakers"
            name="speakers"
            rows={5}
            value={values.speakers}
            onChange={(event) => handleFieldChange('speakers', event.currentTarget.value)}
            aria-invalid={Boolean(state.fieldErrors?.speakers?.length)}
            aria-describedby="speakers-hint speakers-error"
            className="mt-1 block w-full rounded-md border p-2"
          />
          <FieldMessage
            name="speakers"
            state={state}
            hint="One per line: Name | topic | speaker or musical-number. Leave blank if none."
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Closing</h2>
        <div>
          <label htmlFor="closing-hymn-number" className="font-medium">Closing hymn number</label>
          <input
            id="closing-hymn-number"
            name="closingHymnNumber"
            inputMode="numeric"
            required
            value={values.closingHymnNumber}
            onChange={(event) => handleFieldChange('closingHymnNumber', event.currentTarget.value)}
            aria-invalid={Boolean(state.fieldErrors?.closingHymnNumber?.length)}
            aria-describedby="closingHymnNumber-hint closingHymnNumber-error"
            className="mt-1 block w-full rounded-md border p-2"
          />
          <FieldMessage name="closingHymnNumber" state={state} hint="Enter a positive hymn number." />
        </div>
        <div>
          <label htmlFor="closing-hymn-title" className="font-medium">Closing hymn title</label>
          <input
            id="closing-hymn-title"
            name="closingHymnTitle"
            required
            value={values.closingHymnTitle}
            onChange={(event) => handleFieldChange('closingHymnTitle', event.currentTarget.value)}
            aria-invalid={Boolean(state.fieldErrors?.closingHymnTitle?.length)}
            aria-describedby="closingHymnTitle-hint closingHymnTitle-error"
            className="mt-1 block w-full rounded-md border p-2"
          />
          <FieldMessage name="closingHymnTitle" state={state} hint="Enter the hymn title." />
        </div>
        <div>
          <label htmlFor="closing-prayer" className="font-medium">Closing prayer</label>
          <input
            id="closing-prayer"
            name="closingPrayer"
            required
            value={values.closingPrayer}
            onChange={(event) => handleFieldChange('closingPrayer', event.currentTarget.value)}
            aria-invalid={Boolean(state.fieldErrors?.closingPrayer?.length)}
            aria-describedby="closingPrayer-hint closingPrayer-error"
            className="mt-1 block w-full rounded-md border p-2"
          />
          <FieldMessage name="closingPrayer" state={state} hint="Enter who will offer the prayer." />
        </div>
      </section>

      <button type="submit" disabled={pending} className="button-primary disabled:opacity-60">
        {pending ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
