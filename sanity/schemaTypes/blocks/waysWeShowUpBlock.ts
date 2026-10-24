import { defineField, defineType } from 'sanity'

/**
 * Homepage "Ways we show up" section (exaggerated motion moment 3): a
 * scroll-pinned, shuffling card stack. Replaces the old pillarsBlock usage
 * on the homepage specifically — pillarsBlock itself is unchanged and still
 * used by the About page. See components/blocks/WaysWeShowUp/.
 */
export const waysWeShowUpBlock = defineType({
  name: 'waysWeShowUpBlock',
  title: 'Ways we show up (shuffling card stack)',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrowNumber',
      title: 'Eyebrow number',
      type: 'string',
      description: 'e.g. "01"',
      initialValue: '01',
    }),
    defineField({ name: 'eyebrow', title: 'Eyebrow label', type: 'string' }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'text',
      rows: 2,
      description: 'Line breaks are respected — keep it to 2 short lines.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [{ type: 'waysWeShowUpCard' }],
      validation: (r) => r.min(2).max(5),
    }),
    defineField({
      name: 'showSticker',
      title: 'Show sticker badge',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'animation',
      title: 'Animation',
      type: 'string',
      description:
        '"Subtle" skips the scroll-pin — cards auto-shuffle every 4s when in view instead. "None" renders the plain accessible list.',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Subtle', value: 'subtle' },
          { title: 'Exaggerated', value: 'exaggerated' },
        ],
      },
      initialValue: 'exaggerated',
    }),
  ],
  preview: {
    select: { title: 'heading', cards: 'cards' },
    prepare: ({ title, cards }) => ({
      title,
      subtitle: `waysWeShowUpBlock — ${cards?.length ?? 0} card(s)`,
    }),
  },
})
