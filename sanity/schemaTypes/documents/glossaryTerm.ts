import { defineField, defineType } from 'sanity'

export const glossaryTerm = defineType({
  name: 'glossaryTerm',
  title: 'Glossary term',
  type: 'document',
  fields: [
    defineField({ name: 'term', title: 'Term', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'term' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'alsoKnownAs',
      title: 'Also known as',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({ name: 'pronunciation', title: 'Pronunciation', type: 'string' }),
    defineField({
      name: 'shortDefinition',
      title: 'Short definition',
      type: 'text',
      description: 'Used in inline tooltips inside article body text.',
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name: 'fullExplanation',
      title: 'Full explanation',
      type: 'richText',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'relatedTerms',
      title: 'Related terms',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'glossaryTerm' }] }],
    }),
    defineField({
      name: 'relatedArticles',
      title: 'Related articles',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
    }),
    defineField({
      name: 'letter',
      title: 'Letter',
      type: 'string',
      description: 'Computed from the term’s first character, for A–Z grouping.',
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: 'term', subtitle: 'shortDefinition' },
  },
})
