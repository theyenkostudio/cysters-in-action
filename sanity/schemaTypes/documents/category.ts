import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
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
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Inline icon name used on category chips/cards (see components/ui/icon.tsx).',
    }),
    defineField({
      name: 'colour',
      title: 'Colour',
      type: 'string',
      description: 'Brand pillar colour this category borrows for its chip/accent.',
      options: { list: ['teal', 'orchid', 'lagoon'] },
      initialValue: 'teal',
    }),
    defineField({ name: 'order', title: 'Order', type: 'number' }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (r) => r.required(),
        }),
      ],
    }),
  ],
  orderings: [{ name: 'orderAsc', title: 'Order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'slug.current' },
  },
})
