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
