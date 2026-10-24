import { defineField, defineType } from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'eventType',
      title: 'Event type',
      type: 'string',
      description: 'Drives the type tabs and badge.',
      options: { list: ['webinar', 'meetup', 'qna', 'workshop', 'other'] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      options: { list: ['online', 'inPerson', 'hybrid'] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'startDateTime',
      title: 'Start',
      type: 'datetime',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'endDateTime',
      title: 'End',
      type: 'datetime',
      validation: (r) =>
        r.required().custom((value, context) => {
          const start = (context.document as { startDateTime?: string } | undefined)?.startDateTime
          if (value && start && new Date(value) <= new Date(start))
            return 'End must be after the start'
          return true
        }),
    }),
    defineField({
      name: 'timezone',
      title: 'Timezone',
      type: 'string',
      description: 'IANA timezone, e.g. Africa/Accra. Used to build the .ics file.',
      initialValue: 'Africa/Accra',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'summary', title: 'Summary', type: 'text', validation: (r) => r.max(200) }),
    defineField({ name: 'description', title: 'Description', type: 'richText' }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      type: 'object',
      description: 'Hidden unless the format includes in-person.',
      hidden: ({ document }) => document?.format === 'online',
      fields: [
        defineField({ name: 'name', title: 'Venue name', type: 'string' }),
        defineField({ name: 'address', title: 'Address', type: 'address' }),
        defineField({ name: 'mapUrl', title: 'Map URL', type: 'url' }),
      ],
    }),
    defineField({
      name: 'onlineJoinUrl',
      title: 'Online join URL',
      type: 'url',
      description: 'Never rendered publicly — emailed to confirmed RSVPs only.',
      hidden: ({ document }) => document?.format === 'inPerson',
    }),
    defineField({
      name: 'hosts',
      title: 'Hosts',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'author' }, { type: 'teamMember' }] }],
    }),
    defineField({
      name: 'rsvpEnabled',
      title: 'RSVP enabled',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'rsvpMode',
      title: 'RSVP mode',
      type: 'string',
      options: { list: ['internal', 'external'] },
      initialValue: 'internal',
      hidden: ({ document }) => !document?.rsvpEnabled,
    }),
    defineField({
      name: 'externalRsvpUrl',
      title: 'External RSVP URL',
      type: 'url',
      description: 'Required when RSVP mode is external (e.g. Eventbrite, Luma, Zoom).',
      hidden: ({ document }) => document?.rsvpMode !== 'external',
    }),
    defineField({
      name: 'capacity',
      title: 'Capacity',
      type: 'number',
      description: 'Optional. The form closes and shows a waitlist once full.',
    }),
    defineField({ name: 'rsvpDeadline', title: 'RSVP deadline', type: 'datetime' }),
    defineField({
      name: 'recordingUrl',
      title: 'Recording URL',
      type: 'url',
      description: 'Shown on the past event.',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['scheduled', 'cancelled', 'postponed'], layout: 'radio' },
      initialValue: 'scheduled',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
    defineField({
      name: 'reminder24hSentAt',
      title: '24h reminder sent at',
      type: 'datetime',
      readOnly: true,
      description: 'Set automatically by the reminder cron job (Section 7).',
    }),
    defineField({
      name: 'reminder1hSentAt',
      title: '1h reminder sent at',
      type: 'datetime',
      readOnly: true,
      description: 'Set automatically by the reminder cron job (Section 7).',
    }),
  ],
  preview: {
    select: { title: 'title', startDateTime: 'startDateTime', status: 'status' },
    prepare: ({ title, startDateTime, status }) => ({
      title,
      subtitle: `${startDateTime ? new Date(startDateTime).toLocaleDateString() : 'No date'} · ${status}`,
    }),
  },
})
