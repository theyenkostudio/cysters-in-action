import { defineField, defineType } from 'sanity'
import { animationField } from './shared'

export const problemSolutionBlock = defineType({
  name: 'problemSolutionBlock',
  title: 'Problem → solution',
  type: 'object',
  fields: [
    defineField({
      name: 'problemEyebrow',
      title: 'Problem eyebrow',
      type: 'string',
      initialValue: 'The problem',
    }),
    defineField({
      name: 'problemHeading',
      title: 'Problem heading',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'problemBody', title: 'Problem body', type: 'text' }),
    defineField({
      name: 'solutionEyebrow',
      title: 'Solution eyebrow',
      type: 'string',
      initialValue: "What we're doing about it",
    }),
    defineField({
      name: 'solutionHeading',
      title: 'Solution heading',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'solutionBody', title: 'Solution body', type: 'text' }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    animationField(),
  ],
  preview: {
    select: { title: 'problemHeading' },
    prepare: ({ title }) => ({
      title: title || 'Problem → solution',
      subtitle: 'problemSolutionBlock',
    }),
  },
})
