import { categoryLink, pageLink, routeLink } from './links'

export const footer = {
  _placeholder: true as const,
  blurb:
    'Supporting people living with PMOS through reliable health information, genuine community and collective action.',
  columns: [
    {
      heading: 'About',
      links: [
        routeLink('Our mission', '/about'),
        pageLink('Community guidelines', 'community-guidelines'),
      ],
    },
    {
      heading: 'Learn',
      links: [
        routeLink('Learn hub', '/learn'),
        categoryLink('Understanding PMOS', 'understanding-pmos'),
        categoryLink('Myth-busting', 'myth-busting'),
        categoryLink('Talking to your doctor', 'talking-to-your-doctor'),
      ],
    },
    {
      heading: 'More',
      links: [
        routeLink('Contact', '/contact'),
        pageLink('Medical disclaimer', 'medical-disclaimer'),
        pageLink('Accessibility', 'accessibility'),
      ],
    },
  ],
  showNewsletter: true,
  newsletterHeading: 'Newsletter',
  legalLinks: [pageLink('Privacy', 'privacy'), pageLink('Terms', 'terms')],
  copyrightText: '© {year} Cysters In Action. All rights reserved.',
  credit: {
    label: 'Site by Yenko Studio',
    type: 'external' as const,
    external: '#',
    openInNewTab: false,
  },
}
