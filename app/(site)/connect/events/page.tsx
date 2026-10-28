import type { Metadata } from 'next'
import { EventCard } from '@/components/connect/event-card'
import { EventsListing } from '@/components/connect/events-listing'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Reveal } from '@/components/motion/reveal'
import { getEventRsvpCount, getPastEvents, getUpcomingEvents } from '@/lib/sanity/content'
import { seoToMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return seoToMetadata(
    undefined,
    { title: 'Events', description: 'Upcoming and past Cysters In Action events.' },
    '/connect/events',
  )
}

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()])

  // Only upcoming events can take an RSVP, so that's the only set worth the
  // extra round trip — past events in the calendar dialog just show a
  // recording link (or nothing) instead of capacity.
  const rsvpCounts = Object.fromEntries(
    await Promise.all(
      upcoming.map(async (event) => [event._id, await getEventRsvpCount(event._id)] as const),
    ),
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
      <Reveal>
        <Eyebrow>Connect</Eyebrow>
        <h1 className="font-display text-fg-heading mt-4 text-4xl font-semibold">Events</h1>
        <p className="text-fg-muted mt-3 max-w-xl">
          Webinars, meetups and workshops — online and in person.
        </p>
      </Reveal>

      <div className="mt-10">
        <h2 className="sr-only">Upcoming events</h2>
        {upcoming.length > 0 || past.length > 0 ? (
          <EventsListing
            events={upcoming}
            calendarEvents={[...upcoming, ...past]}
            rsvpCounts={rsvpCounts}
          />
        ) : (
          <p className="text-fg-muted">No upcoming events right now — check back soon.</p>
        )}
      </div>

      {past.length > 0 && (
        <section className="border-default mt-16 border-t pt-12">
          <h2 className="font-display text-fg-heading text-2xl font-semibold">Past events</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {past.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
