import { defineField, defineType } from 'sanity'
import { animationField } from './shared'

export const mediaBlock = defineType({
  name: 'mediaBlock',
  title: 'Media',
  type: 'object',
  fields: [
    defineField({ name: 'heroMedia', title: 'Media', type: 'heroMedia' }),
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
    defineField({ name: 'fullBleed', title: 'Full bleed', type: 'boolean', initialValue: false }),
    animationField(),
  ],
  preview: {
    prepare: () => ({ title: 'Media', subtitle: 'mediaBlock' }),
  },
})
