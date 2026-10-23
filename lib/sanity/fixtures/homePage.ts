import type { HeroValue, PageBuilderBlock } from '../types'
import { routeLink } from './links'
import { testimonials } from './testimonials'

export const homePageHero: HeroValue = {
  eyebrow: 'Cysters In Action',
  headline: 'You are not alone\nwith PMOS.\nLet’s act on it together.',
  subline:
    'Reliable health information, genuine community and collective action for people living with PMOS.',
  heroMedia: {
    mediaType: 'image',
    image: {
      url: '/placeholder/hero.jpg',
      alt: 'A calm sunrise over a cloud-streaked horizon',
      credit: 'Tuğba / Pexels',
    },
  },
  overlayStrength: 55,
  overlayDirection: 'left',
  ctas: [
    { link: routeLink('Explore the Learn hub', '/learn'), style: 'solid', action: 'navigate' },
    {
      link: routeLink('Share your story', '/connect/share-your-story'),
      style: 'outline',
      action: 'navigate',
    },
  ],
  height: 'large',
  textAlign: 'left',
}

export const homePageSections: PageBuilderBlock[] = [
  {
    _type: 'missionStatementBlock',
    _key: 'home-mission',
    eyebrow: 'Our story',
    statement:
      'Cysters In Action exists because too many people spend years chasing a diagnosis alone. We Learn together by making health information clear and trustworthy. We Connect through stories and events that remind you you’re not the only one. And we Act, turning that community into collective pressure for better care.',
    highlightWords: [
      { word: 'Learn', colour: 'teal' },
      { word: 'Connect', colour: 'orchid' },
      { word: 'Act', colour: 'lagoon' },
    ],
    animation: 'exaggerated',
  },
  {
    _type: 'pillarsBlock',
    _key: 'home-pillars',
    heading: 'Three ways we show up',
    pillars: [
      {
        title: 'Learn',
        icon: 'learn',
        body: 'Explainers, myth-busters and doctor-question checklists, medically reviewed and kept up to date.',
        link: routeLink('Visit the Learn hub', '/learn'),
      },
      {
        title: 'Connect',
        icon: 'connect',
        body: 'Stories from people living with PMOS, and events where you can meet others going through it.',
        link: routeLink('Share your story', '/connect/share-your-story'),
      },
      {
        title: 'Act',
        icon: 'act',
        body: 'Turning community into collective action — volunteering, partnerships and advocacy.',
        link: routeLink('Get involved', '/about'),
      },
    ],
    animation: 'exaggerated',
  },
  {
    _type: 'statsBlock',
    _key: 'home-stats',
    heading: 'Our impact so far',
    stats: [
      {
        value: 6,
        suffix: '',
        label: 'Learn hub articles published',
        source: 'Placeholder — not real figures yet',
      },
      { value: 5, label: 'Founding Circle members', source: 'Placeholder — not real figures yet' },
      { value: 4, label: 'Health topics covered', source: 'Placeholder — not real figures yet' },
    ],
    background: 'brand',
    animation: 'exaggerated',
  },
  {
    _type: 'problemSolutionBlock',
    _key: 'home-problem-solution',
    problemEyebrow: 'The problem',
    problemHeading: 'PMOS is common, but good information is hard to find',
    problemBody:
      'Many people spend years chasing a diagnosis, relying on scattered forum threads and conflicting advice, often feeling dismissed along the way.',
    solutionEyebrow: 'What we’re doing about it',
    solutionHeading: 'Clear, reviewed information — and a community that gets it',
    solutionBody:
      'Every Learn hub article is written in plain language and medically reviewed. Every story shared by the community is handled with care and, if wanted, anonymity.',
    image: {
      url: '/placeholder/problem-solution.jpg',
      alt: 'A hand holding a small green plant against the sky',
      credit: 'Victor Santos / Pexels',
    },
    animation: 'subtle',
  },
  {
    _type: 'featuredArticlesBlock',
    _key: 'home-featured-articles',
    heading: 'From the Learn hub',
    mode: 'featured',
    limit: 3,
    cta: { link: routeLink('See all articles', '/learn'), style: 'ghost', action: 'navigate' },
    animation: 'subtle',
  },
  {
    _type: 'upcomingEventsBlock',
    _key: 'home-upcoming-events',
    heading: 'Upcoming events',
    showTabs: true,
    limit: 3,
    cta: {
      link: routeLink('See all events', '/connect/events'),
      style: 'ghost',
      action: 'navigate',
    },
    animation: 'subtle',
  },
  {
    _type: 'storiesCarouselBlock',
    _key: 'home-stories-carousel',
    heading: 'Community stories',
    mode: 'featured',
    cta: {
      link: routeLink('Share your story', '/connect/share-your-story'),
      style: 'solid',
      action: 'navigate',
    },
    animation: 'exaggerated',
  },
  {
    _type: 'testimonialBlock',
    _key: 'home-testimonial',
    testimonials,
    layout: 'single',
    animation: 'subtle',
  },
  {
    _type: 'newsletterBlock',
    _key: 'home-newsletter',
    heading: 'Join the newsletter',
    body: 'Occasional emails about new Learn hub articles, events and ways to get involved.',
    buttonLabel: 'Subscribe',
    variant: 'band',
    animation: 'subtle',
  },
  {
    _type: 'ctaBlock',
    _key: 'home-closing-cta',
    heading: 'Ready to take action?',
    body: 'Whichever way you want to show up — reading, sharing, or getting involved — there’s a place for you here.',
    image: {
      url: '/placeholder/cta-closing.jpg',
      alt: 'Close-up of several hands held together',
      credit: 'Shane / Pexels',
    },
    ctas: [
      {
        link: routeLink('Share your story', '/connect/share-your-story'),
        style: 'solid',
        action: 'navigate',
      },
    ],
    background: 'dark',
    animation: 'subtle',
  },
]
