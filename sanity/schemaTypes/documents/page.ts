import { defineField, defineType } from 'sanity'
import { pageBuilderOf } from '../blocks'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'parent',
      title: 'Parent page',
      type: 'reference',
      to: [{ type: 'page' }],
      description: 'For breadcrumbs.',
    }),
    defineField({ name: 'hero', title: 'Hero (optional)', type: 'hero' }),
    defineField({ name: 'sections', title: 'Sections', type: 'array', of: pageBuilderOf }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current' },
    prepare: ({ title, slug }) => ({ title, subtitle: slug ? `/${slug}` : 'No slug' }),
  },
})
