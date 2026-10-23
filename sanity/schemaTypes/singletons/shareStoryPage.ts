import { defineField, defineType } from 'sanity'

export const shareStoryPage = defineType({
  name: 'shareStoryPage',
  title: 'Share your story page',
  type: 'document',
  fields: [
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
    defineField({ name: 'hero', title: 'Hero', type: 'hero' }),
    defineField({ name: 'intro', title: 'Intro', type: 'richText' }),
    defineField({
      name: 'whatHappensNext',
      title: 'What happens next',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'step',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({ name: 'body', title: 'Body', type: 'text' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'consentText',
      title: 'Consent text',
      type: 'richText',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'privacyNote', title: 'Privacy note', type: 'text' }),
    defineField({ name: 'successHeading', title: 'Success heading', type: 'string' }),
    defineField({ name: 'successMessage', title: 'Success message', type: 'text' }),
    defineField({
      name: 'submissionsOpen',
      title: 'Submissions open',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'closedMessage',
      title: 'Closed message',
      type: 'text',
      hidden: ({ document }) => document?.submissionsOpen !== false,
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Share your story page' }),
  },
})
