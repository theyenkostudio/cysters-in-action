import { defineField, defineType } from 'sanity'

/**
 * Homepage "About / impact" section (Section 5): replaces the old separate
 * missionStatementBlock + statsBlock pairing with one block — a heading +
 * lead paragraph on the left/right, and 2-4 stat cards under the paragraph.
 * See components/blocks/about-intro-block.tsx for the layout/animation.
 */
export const aboutIntroBlock = defineType({
  name: 'aboutIntroBlock',
  title: 'About intro (heading, paragraph, stats)',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'About us',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Keep it short — it breaks onto 3-4 lines in the layout.',
      validation: (r) => r.required().max(80),
    }),
    defineField({
      name: 'body',
      title: 'Lead paragraph',
      type: 'text',
      description: 'Plain paragraph — no rich text. Revealed word-by-word as the reader scrolls.',
      validation: (r) => r.required().max(420),
    }),
    defineField({
      name: 'cta',
      title: 'Call to action',
      type: 'cta',
      initialValue: { style: 'outline', link: { label: 'Our mission' } },
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [{ type: 'aboutStat' }],
      validation: (r) => r.min(2).max(4),
    }),
    defineField({
      name: 'animation',
      title: 'Animation',
      type: 'string',
      description:
        '"Subtle" skips the scroll-scrubbed paragraph reveal (it just fades in); numbers still count up either way.',
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
    select: { title: 'heading', stats: 'stats' },
    prepare: ({ title, stats }) => ({
      title,
      subtitle: `aboutIntroBlock — ${stats?.length ?? 0} stat(s)`,
    }),
  },
})
