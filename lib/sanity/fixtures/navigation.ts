import { categoryLink, pageLink, routeLink } from './links'

export const navigation = {
  _placeholder: true as const,
  mainNav: [
    {
      label: 'About',
      items: [
        {
          title: 'Our mission',
          description: 'Who we are and why we started.',
          link: routeLink('Our mission', '/about'),
        },
        {
          title: 'Founding Circle',
          description: 'The people behind Cysters In Action.',
          link: routeLink('Founding Circle', '/about#founding-circle'),
        },
        {
          title: 'Community guidelines',
          description: 'How we keep this space kind and safe.',
          link: pageLink('Community guidelines', 'community-guidelines'),
        },
      ],
    },
    {
      label: 'Learn',
      items: [
        {
          title: 'Learn hub',
          description: 'Explainers, myth-busters and doctor guides.',
          link: routeLink('Learn hub', '/learn'),
        },
        {
          title: 'Myth-busters',
          description: 'Common PMOS myths, checked against the evidence.',
          link: categoryLink('Myth-busters', 'myth-busting'),
        },
        {
          title: 'Questions for your doctor',
          description: 'Printable checklists for your next appointment.',
          link: categoryLink('Questions for your doctor', 'talking-to-your-doctor'),
        },
      ],
    },
    // Connect and Act groups are added in Phase 4 and Phase 6, once stories/
    // events and volunteer/donate exist to link to.
  ],
  secondaryLink: routeLink('Get support', '/contact'),
  primaryCta: {
    style: 'solid',
    action: 'openNewsletter' as const,
    link: routeLink('Join the newsletter', '/newsletter'),
  },
}
