import { defineField, defineType } from 'sanity'
import { animationField } from './shared'

export const faqBlock = defineType({
  name: 'faqBlock',
  title: 'FAQ',
  type: 'object',
  description: 'Also emits FAQPage structured data.',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{ type: 'faqItem' }],
      validation: (r) => r.required().min(1),
    }),
    animationField(),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'FAQ', subtitle: 'faqBlock' }),
  },
})
