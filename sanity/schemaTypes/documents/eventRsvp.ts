import { defineField, defineType } from 'sanity'

// Created by the site (Server Action, write token) — never by an editor.
export const eventRsvp = defineType({
  name: 'eventRsvp',
  title: 'Event RSVP',
  type: 'document',
  fields: [
    defineField({
      name: 'event',
      title: 'Event',
      type: 'reference',
      to: [{ type: 'event' }],
      readOnly: true,
    }),
    defineField({ name: 'name', title: 'Name', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'Email', type: 'email', readOnly: true }),
    defineField({
      name: 'attendance',
      title: 'Attendance',
      type: 'string',
      options: { list: ['attending', 'maybe'] },
      readOnly: true,
    }),
    defineField({
      name: 'questions',
      title: 'Question for the host',
      type: 'text',
      readOnly: true,
    }),
    defineField({
      name: 'consentNewsletter',
      title: 'Newsletter opt-in',
      type: 'boolean',
      readOnly: true,
    }),
    defineField({ name: 'createdAt', title: 'Created at', type: 'datetime', readOnly: true }),
    defineField({
      name: 'emailConfirmed',
      title: 'Confirmation email sent',
      type: 'boolean',
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'email', attendance: 'attendance' },
    prepare: ({ title, subtitle, attendance }) => ({
      title,
      subtitle: `${subtitle} · ${attendance}`,
    }),
  },
})
