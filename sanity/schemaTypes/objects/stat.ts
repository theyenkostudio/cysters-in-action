import { defineField, defineType } from 'sanity'

export const stat = defineType({
  name: 'stat',
  title: 'Stat',
  type: 'object',
  fields: [
    defineField({ name: 'value', title: 'Value', type: 'number', validation: (r) => r.required() }),
    defineField({ name: 'prefix', title: 'Prefix', type: 'string', description: 'e.g. "$"' }),
    defineField({ name: 'suffix', title: 'Suffix', type: 'string', description: 'e.g. "+", "%"' }),
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'source', title: 'Source', type: 'string' }),
  ],
  preview: {
    select: { label: 'label', value: 'value', suffix: 'suffix' },
    prepare: ({ label, value, suffix }) => ({
      title: `${value ?? ''}${suffix ?? ''}`,
      subtitle: label,
    }),
  },
})
