import type { AboutStatValue, HeroValue, PageBuilderBlock } from '../types'
import { routeLink } from './links'
import { testimonials } from './testimonials'
import { waysWeShowUpCards } from './waysWeShowUp'

// NOT real impact figures — see the Studio warning + required `source` on
// aboutStat, and the production-build guard in lib/sanity/content.ts, which
// is designed to fail a real production build while any of these ships with
// `_placeholder: true`.
const aboutIntroStats: (AboutStatValue & { _placeholder: true })[] = [
  {
    value: 120,
    decimals: 0,
    plusSign: true,
    label: 'Community members',
    source: 'Placeholder — not a real figure yet',
    _placeholder: true,
  },
  {
    value: 18,
    decimals: 0,
    plusSign: true,
    label: 'Stories shared',
    source: 'Placeholder — not a real figure yet',
    _placeholder: true,
  },
  {
    value: 6,
    decimals: 0,
    plusSign: false,
    label: 'Events hosted',
    source: 'Placeholder — not a real figure yet',
    _placeholder: true,
  },
]

export const homePageHero: HeroValue = {
  headline: 'You are not alone\nwith PMOS.\nLet’s act on it together.',
  subline:
    'Reliable health information, genuine community and collective action for people living with PMOS.',
  heroMedia: {
    mediaType: 'image',
    image: {
      url: '/placeholder/hero.jpg',
      alt: 'A diverse group of women standing together in solidarity',
      credit: 'RDNE Stock project / Pexels',
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
    _type: 'aboutIntroBlock',
    _key: 'home-about-intro',
    eyebrow: 'About us',
    heading: 'Together, we turn PMOS questions into action.',
    body: 'Cysters In Action exists because too many people spend years chasing a PMOS diagnosis alone. We Learn together by making health information clear and medically reviewed. We Connect through stories and events that remind you you’re not the only one. And we Act, turning that community into collective pressure for better care — one conversation, one shared story, one question answered at a time.',
    cta: { style: 'outline', action: 'navigate', link: routeLink('Our mission', '/about') },
    stats: aboutIntroStats,
    animation: 'exaggerated',
  },
  {
    _type: 'waysWeShowUpBlock',
    _key: 'home-ways-we-show-up',
    eyebrowNumber: '01',
    eyebrow: 'Ways we show up',
    heading: 'THREE WAYS\nWE SHOW UP',
    cards: waysWeShowUpCards,
    showSticker: true,
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
