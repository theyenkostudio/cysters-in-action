import { isPastEvent as isPastEventShared } from '@/lib/events'
import type { EventRef } from '../types'

// Dates are generated relative to "now" (not hardcoded) specifically so the
// past/upcoming split stays correct no matter when this runs — that split
// is a Phase 4 acceptance criterion ("past events leave the upcoming list
// automatically"), so the fixture needs to actually exercise it, not just
// look plausible on the day it was written.
function daysFromNow(days: number, hour = 18, minute = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

type EventFixture = EventRef & { _placeholder: true }

export const events: EventFixture[] = [
  {
    _id: 'event-webinar-understanding-diagnosis',
    _type: 'event',
    _placeholder: true,
    title: 'Understanding Your PMOS Diagnosis: Live Q&A',
    slug: { current: 'understanding-your-pmos-diagnosis-live-qa' },
    eventType: 'qna',
    format: 'online',
    startDateTime: daysFromNow(10, 18),
    endDateTime: daysFromNow(10, 19),
    timezone: 'Africa/Accra',
    summary:
      'An open Q&A with a medical advisor — bring your questions about diagnosis and next steps.',
    onlineJoinUrl: 'https://example.com/placeholder-meeting-link',
    rsvpEnabled: true,
    rsvpMode: 'internal',
    capacity: 100,
    status: 'scheduled',
  },
  {
    _id: 'event-meetup-accra',
    _type: 'event',
    _placeholder: true,
    title: 'Accra Community Meetup',
    slug: { current: 'accra-community-meetup' },
    eventType: 'meetup',
    format: 'inPerson',
    startDateTime: daysFromNow(24, 10),
    endDateTime: daysFromNow(24, 13),
    timezone: 'Africa/Accra',
    summary:
      'An in-person meetup for the Accra community — come as you are, leave when you need to.',
    venue: {
      name: 'Placeholder Community Hall',
      mapUrl: 'https://maps.example.com/placeholder',
    },
    rsvpEnabled: true,
    rsvpMode: 'internal',
    capacity: 5,
    status: 'scheduled',
  },
  {
    _id: 'event-workshop-nutrition',
    _type: 'event',
    _placeholder: true,
    title: 'Nutrition Basics Workshop',
    slug: { current: 'nutrition-basics-workshop' },
    eventType: 'workshop',
    format: 'online',
    startDateTime: daysFromNow(45, 17),
    endDateTime: daysFromNow(45, 18, 30),
    timezone: 'Africa/Accra',
    summary: 'A practical, no-judgement introduction to eating well alongside PMOS.',
    onlineJoinUrl: 'https://example.com/placeholder-meeting-link-2',
    rsvpEnabled: true,
    rsvpMode: 'internal',
    status: 'scheduled',
  },
  {
    _id: 'event-webinar-past',
    _type: 'event',
    _placeholder: true,
    title: 'Myth-Busting Webinar: Fertility and PMOS',
    slug: { current: 'myth-busting-webinar-fertility-and-pmos' },
    eventType: 'webinar',
    format: 'online',
    startDateTime: daysFromNow(-20, 18),
    endDateTime: daysFromNow(-20, 19),
    timezone: 'Africa/Accra',
    summary: 'A recorded session separating fact from fear around fertility and PMOS.',
    recordingUrl: 'https://example.com/placeholder-recording',
    rsvpEnabled: false,
    status: 'scheduled',
  },
]

export function getEventBySlug(slug: string) {
  return events.find((e) => e.slug.current === slug)
}

export function isPastEvent(e: EventRef): boolean {
  return isPastEventShared(e.startDateTime)
}
