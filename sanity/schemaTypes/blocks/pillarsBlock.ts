import { defineField, defineType } from 'sanity'
import { animationField } from './shared'

export const pillarsBlock = defineType({
  name: 'pillarsBlock',
  title: 'Pillars',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'pillars',
      title: 'Pillars',
      type: 'array',
      validation: (r) => r.min(3).max(4),
      of: [
        {
          type: 'object',
          name: 'pillar',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({ name: 'body', title: 'Body', type: 'text' }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: { list: ['learn', 'connect', 'act'] },
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({ name: 'link', title: 'Link', type: 'link' }),
          ],
          preview: { select: { title: 'title' } },
        },
      ],
    }),
    animationField({ exaggerated: true }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Pillars', subtitle: 'pillarsBlock' }),
  },
})
