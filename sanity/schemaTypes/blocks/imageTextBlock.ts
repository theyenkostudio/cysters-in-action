import { defineField, defineType } from 'sanity'
import { animationField } from './shared'

export const imageTextBlock = defineType({
  name: 'imageTextBlock',
  title: 'Image + text',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'body', title: 'Body', type: 'richText' }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (r) => r.required(),
        }),
      ],
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image position',
      type: 'string',
      options: { list: ['left', 'right'] },
      initialValue: 'right',
    }),
    defineField({ name: 'cta', title: 'Call to action', type: 'cta' }),
    animationField(),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Image + text', subtitle: 'imageTextBlock' }),
  },
})
