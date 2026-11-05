import { defineField, defineType } from 'sanity'

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'type',
      title: 'Link type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal page', value: 'internal' },
          { title: 'External URL', value: 'external' },
          { title: 'Email', value: 'email' },
          { title: 'Phone', value: 'phone' },
          { title: 'On this site (path or anchor)', value: 'anchor' },
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'internal',
      title: 'Page',
      type: 'reference',
      // More document types are added here as each ships in its own phase.
      to: [
        { type: 'page' },
        { type: 'article' },
        { type: 'category' },
        { type: 'event' },
        { type: 'story' },
        { type: 'glossaryTerm' },
      ],
      hidden: ({ parent }) => parent?.type !== 'internal',
    }),
    defineField({
      name: 'external',
      title: 'URL',
      // Plain string, not `url` — "On this site" values are site-relative
      // (/connect/share-your-story, /about#mission) and would fail the url
      // type's absolute-URI format check. Strictness per link type is
      // enforced below instead, so a relative path can never be mistaken
      // for (or saved as) a link that actually leaves the site.
      type: 'string',
      description:
        'External URL: an absolute https:// link. On this site: a path (/connect/share-your-story) and/or #anchor. Email/phone: just the address or number — mailto:/tel: is added automatically.',
      hidden: ({ parent }) => parent?.type === 'internal',
      validation: (r) =>
        r.custom((value, context) => {
          const parent = context.parent as { type?: string } | undefined
          if (parent?.type === 'internal') return true
          if (!value) return 'Required for this link type'
          if (value === '#') return true // explicit "not linked yet" placeholder

          switch (parent?.type) {
            case 'external':
              return (
                /^https?:\/\/.+/i.test(value) ||
                'Must be an absolute http(s) URL — use "On this site" for a path on this site'
              )
            case 'anchor':
              return (
                /^[/#]\S*$/.test(value) ||
                'Must be a path starting with / (optionally with a #anchor) or just a #anchor'
              )
            default:
              return true
          }
        }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in a new tab',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => parent?.type === 'internal',
    }),
  ],
  preview: {
    select: { label: 'label', type: 'type' },
    prepare: ({ label, type }) => ({ title: label, subtitle: type }),
  },
})
