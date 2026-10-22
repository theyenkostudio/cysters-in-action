import { defineField, defineType } from 'sanity'

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'text',
      rows: 3,
      description: 'Use Shift+Enter for line breaks — each line animates in separately.',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'subline', title: 'Subline', type: 'text', rows: 2 }),
    defineField({ name: 'heroMedia', title: 'Media', type: 'heroMedia' }),
    defineField({
      name: 'overlayStrength',
      title: 'Overlay strength (%)',
      type: 'number',
      initialValue: 50,
      validation: (r) => r.min(0).max(80),
    }),
    defineField({
      name: 'overlayDirection',
      title: 'Overlay direction',
      type: 'string',
      options: { list: ['left', 'bottom', 'full'] },
      initialValue: 'left',
    }),
    defineField({
      name: 'ctas',
      title: 'Call to actions',
      type: 'array',
      of: [{ type: 'cta' }],
      validation: (r) => r.max(2),
    }),
    defineField({
      name: 'height',
      title: 'Height',
      type: 'string',
      options: { list: ['full', 'large', 'medium'] },
      initialValue: 'large',
    }),
    defineField({
      name: 'textAlign',
      title: 'Text alignment',
      type: 'string',
      options: { list: ['left', 'center'] },
      initialValue: 'left',
    }),
  ],
})
