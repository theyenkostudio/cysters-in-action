import { defineField, defineType } from 'sanity'

// Field-level privacy per Section 6: contactEmail and the three consent
// booleans live in the `private` group and are read-only — they're captured
// once from the form and never edited in Studio. Only `approved` status is
// ever returned by a public query (see articlesByCategoryQuery-style
// filters in lib/sanity/queries.ts); slug is hidden until approval, so a
// story can't accidentally get a public URL before a moderator signs off.
export const story = defineType({
  name: 'story',
  title: 'Community story',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'moderation', title: 'Moderation' },
    { name: 'private', title: 'Private' },
  ],
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'moderation',
      initialValue: 'submitted',
      options: {
        list: ['submitted', 'inReview', 'changesRequested', 'approved', 'rejected', 'withdrawn'],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      description: 'Editable by moderators.',
      validation: (r) => r.required().max(90),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: 'Generated on approval.',
      options: { source: 'title' },
      hidden: ({ document }) => document?.status !== 'approved',
    }),
    defineField({
      name: 'isAnonymous',
      title: 'Anonymous',
      type: 'boolean',
      group: 'content',
      initialValue: false,
    }),
    defineField({
      name: 'authorName',
      title: 'Display name',
      type: 'string',
      group: 'content',
      hidden: ({ document }) => !!document?.isAnonymous,
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'email',
      group: 'private',
      description: 'Private — for follow-up only, never shown publicly.',
      readOnly: true,
    }),
    defineField({
      name: 'ageRange',
      title: 'Age range',
      type: 'string',
      group: 'content',
      options: { list: ['18-24', '25-34', '35-44', '45-54', '55+', 'Prefer not to say'] },
    }),
    defineField({ name: 'country', title: 'Country', type: 'string', group: 'content' }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'richText',
      group: 'content',
      description: 'Plain text from the form, editable by moderators.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'pullQuote',
      title: 'Pull quote',
      type: 'string',
      group: 'content',
      description: 'Chosen by a moderator for cards and the carousel.',
      validation: (r) => r.max(160),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      group: 'content',
      description: 'Optional — only if the submitter consented.',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'themes',
      title: 'Themes',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
        list: ['diagnosis', 'fertility', 'mental health', 'nutrition', 'work', 'relationships'],
      },
    }),
    defineField({
      name: 'contentWarning',
      title: 'Content warning',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'consentPublish',
      title: 'Consent: publish',
      type: 'boolean',
      group: 'private',
      readOnly: true,
    }),
    defineField({
      name: 'consentEdit',
      title: 'Consent: light editing',
      type: 'boolean',
      group: 'private',
      readOnly: true,
    }),
    defineField({
      name: 'consentContact',
      title: 'Consent: contact me',
      type: 'boolean',
      group: 'private',
      readOnly: true,
    }),
    defineField({
      name: 'moderationNotes',
      title: 'Moderation notes',
      type: 'text',
      group: 'moderation',
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted at',
      type: 'datetime',
      group: 'moderation',
      readOnly: true,
    }),
    defineField({
      name: 'approvedAt',
      title: 'Approved at',
      type: 'datetime',
      group: 'moderation',
      readOnly: true,
    }),
    defineField({
      name: 'rejectedAt',
      title: 'Rejected at',
      type: 'datetime',
      group: 'moderation',
      readOnly: true,
      description: 'Drives the 90-day automated cleanup (Section 7).',
    }),
    defineField({
      name: 'featured',
      title: 'Featured (homepage carousel)',
      type: 'boolean',
      group: 'moderation',
    }),
  ],
  preview: {
    select: { title: 'title', status: 'status', anon: 'isAnonymous', name: 'authorName' },
    prepare: ({ title, status, anon, name }) => ({
      title,
      subtitle: `${status} · ${anon ? 'Anonymous' : name}`,
    }),
  },
})
