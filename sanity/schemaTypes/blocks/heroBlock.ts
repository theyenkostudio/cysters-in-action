import { defineField, defineType } from 'sanity'
import { animationField } from './shared'

export const heroBlock = defineType({
  name: 'heroBlock',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({ name: 'hero', title: 'Hero', type: 'hero' }),
    animationField({ exaggerated: true }),
  ],
  preview: {
    select: { title: 'hero.headline' },
    prepare: ({ title }) => ({ title: title || 'Hero', subtitle: 'heroBlock' }),
  },
})
