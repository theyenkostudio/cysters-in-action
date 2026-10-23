import { defineField, defineType } from 'sanity'

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'type',
      title: 'Link type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal page', value: 'internal' },
          { title: 'External URL', value: 'external' },
          { title: 'Email', value: 'email' },
          { title: 'Phone', value: 'phone' },
          { title: 'Anchor on this page', value: 'anchor' },
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'internal',
      title: 'Page',
      type: 'reference',
      // More document types are added here as each ships in its own phase.
      to: [
        { type: 'page' },
        { type: 'article' },
        { type: 'category' },
        { type: 'event' },
        { type: 'story' },
        { type: 'glossaryTerm' },
      ],
      hidden: ({ parent }) => parent?.type !== 'internal',
    }),
    defineField({
      name: 'external',
      title: 'URL',
      type: 'url',
      description: 'http(s), mailto: or tel: depending on the link type above.',
      hidden: ({ parent }) => parent?.type === 'internal',
      validation: (r) =>
        r.custom((value, context) => {
          const parent = context.parent as { type?: string } | undefined
          if (parent?.type === 'internal') return true
          if (!value) return 'Required for this link type'
          return true
        }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in a new tab',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => parent?.type === 'internal',
    }),
  ],
  preview: {
    select: { label: 'label', type: 'type' },
    prepare: ({ label, type }) => ({ title: label, subtitle: type }),
  },
})
