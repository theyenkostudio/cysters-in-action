import type { TestimonialRef } from '../types'

// These used to be pulled from two (clearly fictional) placeholder
// Founding Circle members' `quote` fields. Now that teamMembers.ts carries
// the real Founders Circle, no one's name or role is attached to an
// invented quote — these stand alone as generic placeholder community
// testimonials instead, the same way the "anonymous" entries in stories.ts
// do, until a client-provided testimonial exists to replace them.
export const testimonials: (TestimonialRef & { _placeholder: true })[] = [
  {
    _id: 'testimonial-adwoa-lorem',
    _type: 'testimonial',
    _placeholder: true,
    quote:
      'We started Cysters in Action because no one should have to Google their diagnosis alone.',
    attribution: 'A Cysters in Action community member',
    featured: true,
  },
  {
    _id: 'testimonial-kofi-ipsum',
    _type: 'testimonial',
    _placeholder: true,
    quote: 'Every story we publish is someone’s first time saying it out loud.',
    attribution: 'A Cysters in Action community member',
  },
]
