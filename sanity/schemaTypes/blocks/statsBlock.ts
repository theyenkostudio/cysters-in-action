import { defineField, defineType } from 'sanity'
import { animationField } from './shared'

export const statsBlock = defineType({
  name: 'statsBlock',
  title: 'Stats',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [{ type: 'stat' }],
      validation: (r) => r.min(2).max(4),
    }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      options: { list: ['brand', 'dark', 'light'] },
      initialValue: 'brand',
    }),
    animationField({ exaggerated: true }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Stats', subtitle: 'statsBlock' }),
  },
})
