import { defineField, defineType } from 'sanity'
import { animationField } from './shared'

export const richTextBlock = defineType({
  name: 'richTextBlock',
  title: 'Rich text',
  type: 'object',
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'richText',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'width',
      title: 'Width',
      type: 'string',
      options: { list: ['narrow', 'wide'] },
      initialValue: 'narrow',
    }),
    animationField(),
  ],
  preview: {
    prepare: () => ({ title: 'Rich text', subtitle: 'richTextBlock' }),
  },
})
