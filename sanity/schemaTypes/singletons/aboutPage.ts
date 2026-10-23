import { defineField, defineType } from 'sanity'
import { pageBuilderOf } from '../blocks'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  fields: [
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
    defineField({ name: 'hero', title: 'Hero', type: 'hero' }),
    defineField({ name: 'story', title: 'Our story', type: 'richText' }),
    defineField({
      name: 'pillars',
      title: 'Pillars',
      type: 'array',
      description: 'Learn, Connect, Act — exactly three.',
      validation: (r) => r.length(3),
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
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: { list: ['learn', 'connect', 'act'] },
            }),
            defineField({ name: 'body', title: 'Body', type: 'text' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'values',
      title: 'Values',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'value',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({ name: 'body', title: 'Body', type: 'text' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'foundingCircleHeading',
      title: 'Founding Circle heading',
      type: 'string',
      initialValue: 'The Founding Circle',
    }),
    defineField({
      name: 'foundingCircle',
      title: 'Founding Circle',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'teamMember' }] }],
    }),
    defineField({ name: 'sections', title: 'Sections', type: 'array', of: pageBuilderOf }),
  ],
  preview: {
    prepare: () => ({ title: 'About page' }),
  },
})
