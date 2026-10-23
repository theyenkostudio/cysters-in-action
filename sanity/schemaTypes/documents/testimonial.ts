import { defineField, defineType } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'quote', title: 'Quote', type: 'text', validation: (r) => r.required() }),
    defineField({
      name: 'attribution',
      title: 'Attribution',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'role', title: 'Role / context', type: 'string' }),
    defineField({
      name: 'image',
      title: 'Image (optional)',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'attribution', subtitle: 'quote' },
  },
})
