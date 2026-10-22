import { defineField, defineType } from 'sanity'

export const cta = defineType({
  name: 'cta',
  title: 'Call to action',
  type: 'object',
  fields: [
    defineField({ name: 'link', title: 'Link', type: 'link', validation: (r) => r.required() }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Solid', value: 'solid' },
          { title: 'Outline', value: 'outline' },
          { title: 'Ghost', value: 'ghost' },
        ],
        layout: 'radio',
      },
      initialValue: 'solid',
    }),
    defineField({
      name: 'action',
      title: 'Action',
      type: 'string',
      description: 'What the button does, beyond following the link.',
      options: {
        list: [
          { title: 'Navigate', value: 'navigate' },
          { title: 'Open newsletter signup', value: 'openNewsletter' },
          { title: 'Scroll to a section on this page', value: 'scrollTo' },
        ],
      },
      initialValue: 'navigate',
    }),
  ],
  preview: {
    select: { label: 'link.label', style: 'style' },
    prepare: ({ label, style }) => ({ title: label, subtitle: style }),
  },
})
