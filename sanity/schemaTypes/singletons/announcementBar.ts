import { defineField, defineType } from 'sanity'

export const announcementBar = defineType({
  name: 'announcementBar',
  title: 'Announcement bar',
  type: 'document',
  fields: [
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: false }),
    defineField({
      name: 'label',
      title: 'Label pill',
      type: 'string',
      description: 'e.g. "NEW"',
      validation: (r) => r.max(20),
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'string',
      validation: (r) => r.max(140),
    }),
    defineField({ name: 'link', title: 'Link', type: 'link' }),
    defineField({ name: 'startDate', title: 'Start date', type: 'datetime' }),
    defineField({
      name: 'endDate',
      title: 'End date',
      type: 'datetime',
      validation: (r) =>
        r.custom((value, context) => {
          const start = (context.document as { startDate?: string } | undefined)?.startDate
          if (value && start && new Date(value) <= new Date(start))
            return 'End date must be after the start date'
          return true
        }),
    }),
    defineField({ name: 'dismissible', title: 'Dismissible', type: 'boolean', initialValue: true }),
    defineField({
      name: 'tone',
      title: 'Tone',
      type: 'string',
      options: { list: ['brand', 'neutral', 'alert'] },
      initialValue: 'brand',
    }),
  ],
  preview: {
    select: { title: 'message', enabled: 'enabled' },
    prepare: ({ title, enabled }) => ({
      title: title || 'Announcement bar',
      subtitle: enabled ? 'Enabled' : 'Disabled',
    }),
  },
})
