import { defineField, defineType } from 'sanity'

// Created by the site (Server Action, server-only write token) — never by an
// editor in Studio. Only `status` is editable here; everything else is the
// submitter's own words, read-only.
export const contactSubmission = defineType({
  name: 'contactSubmission',
  title: 'Contact submission',
  type: 'document',
  fields: [
    defineField({ name: 'enquiryType', title: 'Enquiry type', type: 'string', readOnly: true }),
    defineField({ name: 'name', title: 'Name', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'Email', type: 'email', readOnly: true }),
    defineField({ name: 'organisation', title: 'Organisation', type: 'string', readOnly: true }),
    defineField({ name: 'message', title: 'Message', type: 'text', readOnly: true }),
    defineField({ name: 'createdAt', title: 'Created at', type: 'datetime', readOnly: true }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['new', 'replied', 'closed'], layout: 'radio' },
      initialValue: 'new',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'enquiryType', status: 'status' },
    prepare: ({ title, subtitle, status }) => ({ title, subtitle: `${subtitle} · ${status}` }),
  },
})
