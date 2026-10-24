import { defineField, defineType } from 'sanity'

/**
 * One card in the "Ways we show up" shuffling stack — see
 * components/blocks/WaysWeShowUp/. `description` is a deliberately
 * restricted portable text: just plain paragraphs, bold, and a custom
 * `highlight` decorator (rendered in the card's pillar colour), no
 * headings/lists/images — this is a short caption, not an article.
 */
export const waysWeShowUpCard = defineType({
  name: 'waysWeShowUpCard',
  title: 'Card',
  type: 'object',
  fields: [
    defineField({
      name: 'word',
      title: 'Word',
      type: 'string',
      description: 'Rendered uppercase on the card, e.g. "Learn". Keep it short.',
      validation: (r) => r.required().max(10),
    }),
    defineField({
      name: 'pillar',
      title: 'Pillar',
      type: 'string',
      description: "Drives the card's colour (sticker, highlighted word) from the theme.",
      options: {
        list: [
          { title: 'Learn (teal)', value: 'learn' },
          { title: 'Connect (orchid)', value: 'connect' },
          { title: 'Act (lagoon)', value: 'act' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: "Describe what's in the photo — it's shown in black and white on the card.",
          validation: (r) => r.required(),
        }),
        defineField({ name: 'credit', title: 'Credit', type: 'string' }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Highlight (pillar colour)', value: 'highlight' },
            ],
            annotations: [],
          },
        },
      ],
      description: '~35-45 words. Bold 2-3 phrases; highlight exactly one word.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'link',
      description: 'Optional — adds a "Learn more" text link under the description.',
    }),
  ],
  preview: {
    select: { title: 'word', pillar: 'pillar', media: 'image' },
    prepare: ({ title, pillar, media }) => ({ title, subtitle: pillar, media }),
  },
})
