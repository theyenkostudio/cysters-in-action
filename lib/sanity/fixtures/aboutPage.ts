import type { HeroValue, RichTextValue } from '../types'

export const aboutPageHero: HeroValue = {
  eyebrow: 'About us',
  headline: 'Why we started\nCysters In Action',
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

export const aboutPagePillars = [
  {
    title: 'Learn',
    icon: 'learn' as const,
    body: 'Clear, medically-reviewed health information, kept up to date.',
  },
  {
    title: 'Connect',
    icon: 'connect' as const,
    body: 'Stories and events that remind you you’re not the only one.',
  },
  {
    title: 'Act',
    icon: 'act' as const,
    body: 'Turning community into pressure for better care, together.',
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
