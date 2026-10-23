import { defineField, defineType } from 'sanity'
import { animationField } from './shared'

export const logoCloudBlock = defineType({
  name: 'logoCloudBlock',
  title: 'Logo cloud',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'logo',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({ name: 'url', title: 'URL', type: 'url' }),
          ],
          preview: { select: { title: 'alt', media: 'image' } },
        },
      ],
    }),
    animationField({ exaggerated: true }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Logo cloud', subtitle: 'logoCloudBlock' }),
  },
})
