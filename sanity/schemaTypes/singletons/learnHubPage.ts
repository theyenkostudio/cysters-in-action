import { defineField, defineType } from 'sanity'
import { pageBuilderOf } from '../blocks'

export const learnHubPage = defineType({
  name: 'learnHubPage',
  title: 'Learn hub page',
  type: 'document',
  fields: [
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
    defineField({ name: 'hero', title: 'Hero', type: 'hero' }),
    defineField({
      name: 'featuredArticles',
      title: 'Featured articles',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
      validation: (r) => r.max(3),
    }),
    defineField({ name: 'introText', title: 'Intro text', type: 'text' }),
    defineField({
      name: 'showGlossaryTeaser',
      title: 'Show glossary teaser',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'doctorGuidesHeading',
      title: 'Doctor guides heading',
      type: 'string',
      initialValue: 'Questions for your doctor',
    }),
    defineField({ name: 'sections', title: 'Sections', type: 'array', of: pageBuilderOf }),
  ],
  preview: {
    prepare: () => ({ title: 'Learn hub page' }),
  },
})
