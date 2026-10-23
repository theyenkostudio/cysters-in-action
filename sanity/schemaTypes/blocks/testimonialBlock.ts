import { defineField, defineType } from 'sanity'
import { animationField } from './shared'

export const testimonialBlock = defineType({
  name: 'testimonialBlock',
  title: 'Testimonial',
  type: 'object',
  fields: [
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'testimonial' }] }],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: { list: ['single', 'slider'] },
      initialValue: 'single',
    }),
    animationField(),
  ],
  preview: {
    prepare: () => ({ title: 'Testimonial', subtitle: 'testimonialBlock' }),
  },
})
