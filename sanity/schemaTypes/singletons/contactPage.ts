import { defineField, defineType } from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact page',
  type: 'document',
  fields: [
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
    defineField({ name: 'hero', title: 'Hero', type: 'hero' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text' }),
    defineField({
      name: 'enquiryTypes',
      title: 'Enquiry types',
      type: 'array',
      description: 'Shown as a select on the contact form. Each routes to an inbox email.',
      validation: (r) => r.required().min(1),
      of: [
        {
          type: 'object',
          name: 'enquiryType',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              description: 'Stable identifier, e.g. "partnership". Not shown to visitors.',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'routeToEmail',
              title: 'Route to email',
              type: 'email',
              description: 'Falls back to siteSettings.contactEmail if left blank.',
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'routeToEmail' } },
        },
      ],
    }),
    defineField({ name: 'successMessage', title: 'Success message', type: 'text' }),
    defineField({ name: 'showMap', title: 'Show map', type: 'boolean', initialValue: false }),
    defineField({
      name: 'mapEmbedUrl',
      title: 'Map embed URL',
      type: 'url',
      hidden: ({ document }) => !document?.showMap,
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Contact page' }),
  },
})
