import { defineField, defineType } from 'sanity'
import { animationField } from './shared'

export const newsletterBlock = defineType({
  name: 'newsletterBlock',
  title: 'Newsletter',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow (hive variant)', type: 'string' }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Join the newsletter',
    }),
    defineField({ name: 'body', title: 'Body', type: 'text' }),
    defineField({
      name: 'buttonLabel',
      title: 'Button label',
      type: 'string',
      initialValue: 'Subscribe',
    }),
    defineField({ name: 'successMessage', title: 'Success message', type: 'text' }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: { list: ['band', 'card', 'hive'] },
      initialValue: 'band',
    }),
    animationField(),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Newsletter', subtitle: 'newsletterBlock' }),
  },
})
