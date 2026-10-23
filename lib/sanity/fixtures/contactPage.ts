import type { HeroValue } from '../types'

export const contactPageHero: HeroValue = {
  eyebrow: 'Contact',
  headline: 'Get in touch',
  subline: 'Questions, partnership ideas, media enquiries — we read every message.',
  heroMedia: {
    mediaType: 'image',
    image: {
      url: '/placeholder/cta-closing.jpg',
      alt: 'Close-up of several hands held together',
      credit: 'Shane / Pexels',
    },
  },
  overlayStrength: 50,
  overlayDirection: 'left',
  height: 'medium',
  textAlign: 'left',
}

export const contactPageIntro =
  'Pick the option that best describes why you’re reaching out, and we’ll route your message to the right inbox.'

export const contactPageEnquiryTypes: { label: string; value: string; routeToEmail?: string }[] = [
  { label: 'General enquiry', value: 'general' },
  { label: 'Partnership', value: 'partnership', routeToEmail: 'partnerships@cystersinaction.org' },
  { label: 'Media', value: 'media', routeToEmail: 'media@cystersinaction.org' },
]

export const contactPageSuccessMessage = 'Thanks — we’ll be in touch soon.'
