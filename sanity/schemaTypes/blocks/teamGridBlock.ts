import { defineField, defineType } from 'sanity'
import { animationField } from './shared'

export const teamGridBlock = defineType({
  name: 'teamGridBlock',
  title: 'Team grid',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'group',
      title: 'Group filter',
      type: 'string',
      description:
        'Shows every teamMember in this group, ordered by their Order field. Leave blank to choose members manually below.',
      options: { list: ['foundingCircle', 'advisor', 'volunteer'] },
    }),
    defineField({
      name: 'members',
      title: 'Members (manual)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'teamMember' }] }],
      hidden: ({ parent }) => !!parent?.group,
    }),
    animationField(),
  ],
  preview: {
    select: { title: 'heading', group: 'group' },
    prepare: ({ title, group }) => ({ title: title || 'Team grid', subtitle: group ?? 'manual' }),
  },
})
