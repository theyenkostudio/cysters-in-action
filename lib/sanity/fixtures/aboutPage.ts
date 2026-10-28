import type { HeroValue, PageBuilderBlock, RichTextValue, SanityImage } from '../types'

export const aboutPageHero: HeroValue = {
  eyebrow: 'About us',
  headline: 'We are Cysters In Action',
  subline: 'A community built by people who’ve lived through a PMOS diagnosis themselves.',
  heroMedia: {
    mediaType: 'image',
    image: {
      url: '/placeholder/about-hero.jpg',
      alt: 'Close-up of several hands held together in a show of unity',
      credit: 'Thirdman / Pexels',
    },
  },
  overlayStrength: 50,
  overlayDirection: 'left',
  height: 'medium',
  textAlign: 'left',
}

export const aboutPageStory: RichTextValue = [
  {
    _type: 'block',
    _key: 'story-1',
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: 'story-1-span',
        text: 'Cysters In Action started as a group chat between friends who were each, separately, trying to make sense of a PMOS diagnosis. We shared what we found — the useful articles, the dead-end forum threads, the doctors who actually listened — and realised that just having each other made an overwhelming process feel more manageable.',
      },
    ],
  },
  {
    _type: 'block',
    _key: 'story-2',
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: 'story-2-span',
        text: 'This site is that group chat, opened up. Reliable information, real community, and a place to turn shared frustration into action.',
      },
    ],
  },
]

// Same photo as this page's own Hero (aboutPageHero above) — no dedicated
// "our story" photo exists yet, so this reuses it rather than inventing a
// new placeholder image.
export const aboutPageStoryImage: SanityImage = {
  url: '/placeholder/about-hero.jpg',
  alt: 'Close-up of several hands held together in a show of unity',
  credit: 'Thirdman / Pexels',
}

export const aboutPagePillars = [
  {
    title: 'Learn',
    icon: 'learn' as const,
    body: 'Clear, medically-reviewed health information, kept up to date.',
    image: {
      url: '/placeholder/pillar-learn.jpg',
      alt: 'Woman reading her notes',
      credit: 'Pixabay / Pexels',
    } satisfies SanityImage,
  },
  {
    title: 'Connect',
    icon: 'connect' as const,
    body: 'Stories and events that remind you you’re not the only one.',
    image: {
      url: '/placeholder/pillar-connect.jpg',
      alt: 'Photo of women sitting while talking',
      credit: 'RF._.studio / Pexels',
    } satisfies SanityImage,
  },
  {
    title: 'Act',
    icon: 'act' as const,
    body: 'Turning community into pressure for better care, together.',
    image: {
      url: '/placeholder/pillar-act.jpg',
      alt: 'Smiling woman carrying a donation box',
      credit: 'Gustavo Fring / Pexels',
    } satisfies SanityImage,
  },
]

export const aboutPageValues = [
  {
    title: 'Evidence over anecdote',
    body: 'Every Learn hub article carries a medical reviewer and a last-reviewed date.',
  },
  { title: 'Privacy by default', body: 'Anonymous means anonymous — no exceptions, ever.' },
  {
    title: 'Nothing about us without us',
    body: 'People living with PMOS shape what we publish and how we run events.',
  },
]

// Same `hive` component as the homepage's closing section, with About-
// specific heading/body — HiveNewsletter already takes these as props
// (eyebrow/heading/body), so no component changes were needed, just
// different fixture copy.
export const aboutPageSections: PageBuilderBlock[] = [
  {
    _type: 'newsletterBlock',
    _key: 'about-newsletter',
    eyebrow: 'Join us',
    heading: 'Want to be part of this?',
    body: 'Join the newsletter to hear from the community, get first word on events, and stay close to what we’re building.',
    buttonLabel: 'Join',
    variant: 'hive',
    animation: 'exaggerated',
  },
]
