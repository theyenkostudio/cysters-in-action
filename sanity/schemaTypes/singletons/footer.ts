import { defineArrayMember, defineField, defineType } from 'sanity'

export const footer = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'blurb',
      title: 'Blurb',
      type: 'text',
      description: 'Short mission line under the logo.',
    }),
    defineField({
      name: 'columns',
      title: 'Link columns',
      type: 'array',
      validation: (r) => r.max(4),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'column',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({ name: 'links', title: 'Links', type: 'array', of: [{ type: 'link' }] }),
          ],
          preview: {
            select: { title: 'heading', links: 'links' },
            prepare: ({ title, links }) => ({ title, subtitle: `${links?.length ?? 0} links` }),
          },
        }),
      ],
    }),
    defineField({
      name: 'showNewsletter',
      title: 'Show newsletter form',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'newsletterHeading',
      title: 'Newsletter heading',
      type: 'string',
      hidden: ({ document }) => !document?.showNewsletter,
    }),
    defineField({
      name: 'legalLinks',
      title: 'Legal links',
      type: 'array',
      of: [{ type: 'link' }],
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright text',
      type: 'string',
      description: 'Use {year} as a token — replaced with the current year at render time.',
      initialValue: '© {year} Cysters In Action. All rights reserved.',
    }),
    defineField({
      name: 'credit',
      title: 'Credit',
      type: 'link',
      description: '"Site by Yenko Studio"',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Footer' }),
  },
})
