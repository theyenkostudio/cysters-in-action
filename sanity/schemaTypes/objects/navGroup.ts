import { defineField, defineType } from 'sanity'

export const navGroup = defineType({
  name: 'navGroup',
  title: 'Nav group',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'link',
      title: 'Link (optional)',
      type: 'link',
      description: 'If set, the label itself is also a link, in addition to opening the dropdown.',
    }),
    defineField({
      name: 'featured',
      title: 'Featured card (dropdown)',
      type: 'object',
      description: 'Photo card shown beside the links when this dropdown is open.',
      fields: [
        defineField({
          name: 'eyebrow',
          title: 'Eyebrow',
          type: 'string',
          validation: (r) => r.max(40),
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: (r) => r.required().max(60),
        }),
        defineField({
          name: 'description',
          title: 'Short description',
          type: 'string',
          validation: (r) => r.max(120),
        }),
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
        }),
        defineField({ name: 'link', title: 'Link', type: 'link', validation: (r) => r.required() }),
      ],
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{ type: 'navItem' }],
    }),
  ],
  preview: {
    select: { title: 'label', items: 'items' },
    prepare: ({ title, items }) => ({ title, subtitle: `${items?.length ?? 0} items` }),
  },
})
