import { defineField, defineType } from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: { list: ['writer', 'medicalReviewer', 'communityMember'] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'credentials',
      title: 'Credentials',
      type: 'string',
      description: 'e.g. "MD, Gynaecologist"',
    }),
    defineField({ name: 'bio', title: 'Bio', type: 'text' }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [{ type: 'socialLink' }],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role' },
  },
})
