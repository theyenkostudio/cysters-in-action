import type { CategoryRef } from '../types'

export const categories: (CategoryRef & { _placeholder: true })[] = [
  {
    _id: 'category-understanding-pmos',
    _type: 'category',
    _placeholder: true,
    title: 'Understanding PMOS',
    slug: { current: 'understanding-pmos' },
    description: 'Plain-language explainers on what PMOS is and how it affects the body.',
    icon: 'book-open',
    colour: 'teal',
    order: 1,
    image: {
      url: '/placeholder/category-explainer.jpg',
      alt: 'A hand gently cradling a small green seedling',
    },
  },
  {
    _id: 'category-myth-busting',
    _type: 'category',
    _placeholder: true,
    title: 'Myth-busting',
    slug: { current: 'myth-busting' },
    description: 'Common myths about PMOS, checked against the evidence.',
    icon: 'lightbulb',
    colour: 'orchid',
    order: 2,
    image: {
      url: '/placeholder/category-mythbuster.jpg',
      alt: 'A clear lightbulb against a bright background',
    },
  },
  {
    _id: 'category-talking-to-your-doctor',
    _type: 'category',
    _placeholder: true,
    title: 'Talking to your doctor',
    slug: { current: 'talking-to-your-doctor' },
    description: 'Question checklists to help you prepare for appointments.',
    icon: 'clipboard-list',
    colour: 'teal',
    order: 3,
    image: {
      url: '/placeholder/category-doctorguide.jpg',
      alt: 'Close-up of a hand writing notes in a notebook',
    },
  },
  {
    _id: 'category-living-well',
    _type: 'category',
    _placeholder: true,
    title: 'Living well',
    slug: { current: 'living-well' },
    description: 'Everyday habits, nutrition and wellbeing with PMOS.',
    icon: 'heart',
    colour: 'lagoon',
    order: 4,
    image: {
      url: '/placeholder/category-livingwell.jpg',
      alt: 'A warm cup of tea in soft sunlight',
    },
  },
]

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug.current === slug)
}
