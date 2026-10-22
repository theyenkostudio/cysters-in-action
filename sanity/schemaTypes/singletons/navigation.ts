import { defineField, defineType } from 'sanity'

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'mainNav',
      title: 'Main navigation',
      type: 'array',
      of: [{ type: 'navGroup' }],
      description: 'About, Learn, Connect, Act — each a dropdown group.',
    }),
    defineField({
      name: 'secondaryLink',
      title: 'Secondary link',
      type: 'link',
      description: 'e.g. "Get support"',
    }),
    defineField({
      name: 'primaryCta',
      title: 'Primary call to action',
      type: 'cta',
      description: 'e.g. "Join the newsletter"',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Navigation' }),
  },
})
