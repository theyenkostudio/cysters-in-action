import { defineField, defineType } from 'sanity'
import { animationField } from './shared'

export const missionStatementBlock = defineType({
  name: 'missionStatementBlock',
  title: 'Mission statement',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({
      name: 'statement',
      title: 'Statement',
      type: 'text',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'highlightWords',
      title: 'Highlight words',
      type: 'array',
      description:
        'Words in the statement to highlight in a pillar colour (e.g. Learn, Connect, Act).',
      of: [
        {
          type: 'object',
          name: 'highlightWord',
          fields: [
            defineField({
              name: 'word',
              title: 'Word',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'colour',
              title: 'Colour',
              type: 'string',
              options: { list: ['teal', 'orchid', 'lagoon'] },
              validation: (r) => r.required(),
            }),
          ],
        },
      ],
    }),
    defineField({ name: 'cta', title: 'Call to action', type: 'cta' }),
    animationField({ exaggerated: true }),
  ],
  preview: {
    select: { title: 'statement' },
    prepare: ({ title }) => ({ title, subtitle: 'missionStatementBlock' }),
  },
})
