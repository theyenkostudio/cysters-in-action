import { defineField, defineType } from 'sanity'
import { pageBuilderOf } from '../blocks'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  fields: [
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
    defineField({ name: 'hero', title: 'Hero', type: 'hero' }),
    defineField({ name: 'sections', title: 'Sections', type: 'array', of: pageBuilderOf }),
  ],
  preview: {
    prepare: () => ({ title: 'Home page' }),
  },
})
