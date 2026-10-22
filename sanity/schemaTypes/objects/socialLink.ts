import { defineField, defineType } from 'sanity'

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social link',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          'Instagram',
          'TikTok',
          'X',
          'Facebook',
          'LinkedIn',
          'YouTube',
          'Threads',
          'WhatsApp channel',
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'url', title: 'URL', type: 'url', validation: (r) => r.required() }),
    defineField({
      name: 'handle',
      title: 'Handle',
      type: 'string',
      description: 'e.g. @cystersinaction',
    }),
  ],
  preview: {
    select: { title: 'platform', subtitle: 'handle' },
  },
})
