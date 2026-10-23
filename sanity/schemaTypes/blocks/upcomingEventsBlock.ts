import { defineField, defineType } from 'sanity'
import { animationField } from './shared'

export const upcomingEventsBlock = defineType({
  name: 'upcomingEventsBlock',
  title: 'Upcoming events',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'showTabs', title: 'Show type tabs', type: 'boolean', initialValue: true }),
    defineField({
      name: 'eventTypes',
      title: 'Event types filter',
      type: 'array',
      description: 'Leave empty to show every type.',
      of: [{ type: 'string' }],
      options: { list: ['webinar', 'meetup', 'qna', 'workshop', 'other'] },
    }),
    defineField({ name: 'limit', title: 'Limit', type: 'number', initialValue: 3 }),
    defineField({ name: 'cta', title: 'Call to action', type: 'cta' }),
    animationField(),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({
      title: title || 'Upcoming events',
      subtitle: 'upcomingEventsBlock',
    }),
  },
})
