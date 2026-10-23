import { defineField, defineType } from 'sanity'
import { animationField } from './shared'

export const storiesCarouselBlock = defineType({
  name: 'storiesCarouselBlock',
  title: 'Stories carousel',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'mode',
      title: 'Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Featured', value: 'featured' },
          { title: 'Latest', value: 'latest' },
          { title: 'Manual', value: 'manual' },
        ],
      },
      initialValue: 'featured',
    }),
    defineField({
      name: 'stories',
      title: 'Stories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'story' }] }],
      hidden: ({ parent }) => parent?.mode !== 'manual',
    }),
    defineField({ name: 'cta', title: 'Call to action', type: 'cta' }),
    animationField({ exaggerated: true }),
  ],
  preview: {
    select: { title: 'heading', mode: 'mode' },
    prepare: ({ title, mode }) => ({ title: title || 'Stories carousel', subtitle: mode }),
  },
})
