import type { RichTextValue, WaysWeShowUpCardValue } from '../types'
import { routeLink } from './links'

type Segment = { text: string; marks?: ('strong' | 'highlight')[] }

/** Builds a single-paragraph portable text value from plain/bold/highlighted runs. */
function description(key: string, segments: Segment[]): RichTextValue {
  return [
    {
      _type: 'block',
      _key: `${key}-block`,
      style: 'normal',
      markDefs: [],
      children: segments.map((segment, i) => ({
        _type: 'span',
        _key: `${key}-span-${i}`,
        text: segment.text,
        marks: segment.marks ?? [],
      })),
    },
  ]
}

export const waysWeShowUpCards: (WaysWeShowUpCardValue & { _placeholder: true })[] = [
  {
    word: 'Learn',
    pillar: 'learn',
    image: {
      url: '/placeholder/wwsu-learn.jpg',
      alt: 'A close-up of a hand writing in a notebook',
      credit: 'Tima Miroshnichenko / Pexels',
    },
    description: description('learn', [
      { text: 'Too many people spend years chasing a diagnosis alone. We turn ' },
      { text: 'confusing symptoms', marks: ['strong'] },
      { text: ' into clear, ' },
      { text: 'medically reviewed answers', marks: ['strong'] },
      {
        text: ', with doctor-question checklists built for real appointments, so you walk into every visit with real ',
      },
      { text: 'hope', marks: ['highlight'] },
      { text: ' and the confidence to be heard.' },
    ]),
    link: routeLink('Visit the Learn hub', '/learn'),
    _placeholder: true,
  },
  {
    word: 'Connect',
    pillar: 'connect',
    image: {
      url: '/placeholder/wwsu-connect.jpg',
      alt: 'Two hands of different skin tones reaching toward each other',
      credit: 'Roberto Hund / Pexels',
    },
    description: description('connect', [
      {
        text: 'You are not the only one. Our stories and events bring people living with PMOS together into a genuine ',
      },
      { text: 'community', marks: ['highlight'] },
      { text: ', not a comment section, where you can ' },
      { text: 'ask the hard questions', marks: ['strong'] },
      { text: ' and ' },
      { text: 'finally feel understood', marks: ['strong'] },
      { text: ' — maybe for the first time.' },
    ]),
    link: routeLink('Share your story', '/connect/share-your-story'),
    _placeholder: true,
  },
  {
    word: 'Act',
    pillar: 'act',
    image: {
      url: '/placeholder/wwsu-act.jpg',
      alt: 'A group of hands of different skin tones stacked together from above',
      credit: 'Diva Plavalaguna / Pexels',
    },
    description: description('act', [
      { text: 'Understanding alone is not enough. We turn shared stories into collective ' },
      { text: 'pressure', marks: ['highlight'] },
      { text: ' for better care, through ' },
      { text: 'volunteering, partnerships and advocacy', marks: ['strong'] },
      { text: ' that ' },
      { text: 'push clinics and policy', marks: ['strong'] },
      { text: ' to actually listen, so the next diagnosis takes months, not years.' },
    ]),
    link: routeLink('Get involved', '/about'),
    _placeholder: true,
  },
]
