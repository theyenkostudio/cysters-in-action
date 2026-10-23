import { defineField, defineType } from 'sanity'

export const formBlock = defineType({
  name: 'formBlock',
  title: 'Form',
  type: 'object',
  fields: [
    defineField({
      name: 'formType',
      title: 'Form type',
      type: 'string',
      options: {
        list: [
          { title: 'Contact', value: 'contact' },
          { title: 'Volunteer (Phase 6)', value: 'volunteer' },
          { title: 'Partner (Phase 6)', value: 'partner' },
          { title: 'Newsletter', value: 'newsletter' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text' }),
    // No animation field: formBlock is always `none` per Section 6's block table.
  ],
  preview: {
    select: { title: 'heading', type: 'formType' },
    prepare: ({ title, type }) => ({ title: title || 'Form', subtitle: type }),
  },
})
