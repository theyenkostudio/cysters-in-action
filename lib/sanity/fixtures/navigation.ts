import { categoryLink, routeLink } from './links'

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
          link: routeLink('Community guidelines', '/connect/guidelines'),
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
        {
          title: 'Glossary',
          description: 'Plain-language definitions of PMOS-related terms.',
          link: routeLink('Glossary', '/learn/glossary'),
        },
      ],
    },
    {
      label: 'Connect',
      items: [
        {
          title: 'Stories',
          description: 'Shared by people living with PMOS.',
          link: routeLink('Stories', '/connect/stories'),
        },
        {
          title: 'Share your story',
          description: 'Named or anonymous — your choice.',
          link: routeLink('Share your story', '/connect/share-your-story'),
        },
        {
          title: 'Events',
          description: 'Webinars, meetups and workshops.',
          link: routeLink('Events', '/connect/events'),
        },
      ],
    },
    // Act group is added in Phase 6, once volunteer/donate exist to link to.
  ],
  secondaryLink: routeLink('Get support', '/contact'),
  primaryCta: {
    style: 'solid',
    action: 'openNewsletter' as const,
    link: routeLink('Join the newsletter', '/newsletter'),
  },
}
