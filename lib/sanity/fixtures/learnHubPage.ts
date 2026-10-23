import type { HeroValue } from '../types'
import { articles } from './articles'

export const learnHubPageHero: HeroValue = {
  eyebrow: 'Learn',
  headline: 'Clear, reviewed\nhealth information',
  subline: 'Explainers, myth-busters and doctor-question checklists — written in plain language.',
  heroMedia: {
    mediaType: 'image',
    image: {
      url: '/placeholder/learn-hub-hero.jpg',
      alt: 'A stack of books on a table',
      credit: 'Darya Grey_Owl / Pexels',
    },
  },
  overlayStrength: 50,
  overlayDirection: 'left',
  height: 'medium',
  textAlign: 'left',
}

export const learnHubFeaturedArticles = articles.filter((a) => a.featured)
export const learnHubIntroText =
  'Every article here is written in plain language and reviewed by a medical professional before it’s published. If something feels out of date, let us know.'
