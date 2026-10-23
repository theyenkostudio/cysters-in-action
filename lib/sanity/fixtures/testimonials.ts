import type { TestimonialRef } from '../types'
import { teamMembers } from './teamMembers'

// Built from the (clearly fictional, placeholder) Founding Circle quotes
// rather than inventing a new "community member" story — see
// teamMembers.ts for why we don't fabricate anonymous community voices.
const founder = teamMembers[0]
const communityLead = teamMembers[1]

export const testimonials: (TestimonialRef & { _placeholder: true })[] = [
  {
    _id: 'testimonial-adwoa-lorem',
    _type: 'testimonial',
    _placeholder: true,
    quote: founder.quote!,
    attribution: founder.name,
    role: founder.role,
    featured: true,
  },
  {
    _id: 'testimonial-kofi-ipsum',
    _type: 'testimonial',
    _placeholder: true,
    quote: communityLead.quote!,
    attribution: communityLead.name,
    role: communityLead.role,
  },
]
