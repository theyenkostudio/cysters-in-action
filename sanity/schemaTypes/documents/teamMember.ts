import { defineField, defineType } from 'sanity'

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team member',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', title: 'Role', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'group',
      title: 'Group',
      type: 'string',
      options: { list: ['foundingCircle', 'advisor', 'volunteer'] },
      initialValue: 'foundingCircle',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({ name: 'bio', title: 'Bio', type: 'text' }),
    defineField({ name: 'quote', title: 'Quote', type: 'string' }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [{ type: 'socialLink' }],
    }),
    defineField({ name: 'order', title: 'Order', type: 'number' }),
  ],
  orderings: [{ name: 'orderAsc', title: 'Order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name', subtitle: 'role' },
  },
})
