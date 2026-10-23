import { defineArrayMember, defineField, defineType } from 'sanity'

export const richText = defineType({
  name: 'richText',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Heading 4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [defineField({ name: 'link', title: 'Link', type: 'link' })],
          },
          {
            name: 'glossaryTerm',
            title: 'Glossary term',
            type: 'object',
            fields: [
              defineField({
                name: 'term',
                title: 'Term',
                type: 'reference',
                to: [{ type: 'glossaryTerm' }],
                validation: (r) => r.required(),
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      name: 'image',
      title: 'Image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (r) => r.required(),
        }),
        defineField({ name: 'caption', title: 'Caption', type: 'string' }),
      ],
    }),
    defineArrayMember({
      type: 'object',
      name: 'callout',
      title: 'Callout',
      fields: [
        defineField({
          name: 'tone',
          title: 'Tone',
          type: 'string',
          options: { list: ['info', 'warning', 'tip'] },
          initialValue: 'info',
        }),
        defineField({ name: 'text', title: 'Text', type: 'text' }),
      ],
      preview: {
        select: { tone: 'tone', text: 'text' },
        prepare: ({ tone, text }) => ({ title: text, subtitle: `Callout · ${tone}` }),
      },
    }),
    defineArrayMember({
      type: 'object',
      name: 'mythFact',
      title: 'Myth / fact',
      fields: [
        defineField({ name: 'myth', title: 'Myth', type: 'text', validation: (r) => r.required() }),
        defineField({ name: 'fact', title: 'Fact', type: 'text', validation: (r) => r.required() }),
        defineField({ name: 'sourceUrl', title: 'Source URL', type: 'url' }),
      ],
      preview: {
        select: { title: 'myth' },
        prepare: ({ title }) => ({ title, subtitle: 'Myth / fact' }),
      },
    }),
    defineArrayMember({
      type: 'object',
      name: 'doctorQuestions',
      title: 'Questions for your doctor',
      fields: [
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({
          name: 'questions',
          title: 'Questions',
          type: 'array',
          of: [{ type: 'string' }],
        }),
      ],
      preview: {
        select: { title: 'title' },
        prepare: ({ title }) => ({ title, subtitle: 'Doctor questions checklist' }),
      },
    }),
    defineArrayMember({
      type: 'object',
      name: 'videoEmbed',
      title: 'Video embed',
      fields: [
        defineField({
          name: 'url',
          title: 'Video URL',
          type: 'url',
          validation: (r) => r.required(),
        }),
        defineField({ name: 'caption', title: 'Caption', type: 'string' }),
      ],
      preview: {
        select: { subtitle: 'url' },
        prepare: ({ subtitle }) => ({ title: 'Video embed', subtitle }),
      },
    }),
    defineArrayMember({
      type: 'object',
      name: 'button',
      title: 'Button',
      fields: [defineField({ name: 'cta', title: 'Button', type: 'cta' })],
      preview: {
        select: { title: 'cta.link.label' },
        prepare: ({ title }) => ({ title, subtitle: 'Button' }),
      },
    }),
  ],
})
