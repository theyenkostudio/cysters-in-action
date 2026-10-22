import { defineField, defineType } from 'sanity'

export const navItem = defineType({
  name: 'navItem',
  title: 'Nav item',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'description',
      title: 'One-line description',
      type: 'string',
      validation: (r) => r.max(100),
    }),
    defineField({ name: 'link', title: 'Link', type: 'link', validation: (r) => r.required() }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: '@sanity/icons name, e.g. "heart"',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
})
