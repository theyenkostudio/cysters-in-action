import { defineField, defineType } from 'sanity'
import { animationField } from './shared'

export const featuredArticlesBlock = defineType({
  name: 'featuredArticlesBlock',
  title: 'Featured articles',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'mode',
      title: 'Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Latest', value: 'latest' },
          { title: 'Featured', value: 'featured' },
          { title: 'Manual', value: 'manual' },
          { title: 'By category', value: 'byCategory' },
        ],
      },
      initialValue: 'latest',
    }),
    defineField({
      name: 'articles',
      title: 'Articles',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
      hidden: ({ parent }) => parent?.mode !== 'manual',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      hidden: ({ parent }) => parent?.mode !== 'byCategory',
    }),
    defineField({ name: 'limit', title: 'Limit', type: 'number', initialValue: 3 }),
    defineField({ name: 'cta', title: 'Call to action', type: 'cta' }),
    animationField(),
  ],
  preview: {
    select: { title: 'heading', mode: 'mode' },
    prepare: ({ title, mode }) => ({ title: title || 'Featured articles', subtitle: mode }),
  },
})
