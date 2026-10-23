import { defineField, defineType } from 'sanity'
import { animationField } from './shared'

export const ctaBlock = defineType({
  name: 'ctaBlock',
  title: 'Call to action',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'body', title: 'Body', type: 'text' }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'ctas',
      title: 'Call to actions',
      type: 'array',
      of: [{ type: 'cta' }],
      validation: (r) => r.max(2),
    }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      options: { list: ['light', 'dark', 'brand'] },
      initialValue: 'dark',
    }),
    animationField(),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title, subtitle: 'ctaBlock' }),
  },
})
