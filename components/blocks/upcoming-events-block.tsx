import { EventCard } from '@/components/connect/event-card'
import { ButtonLink } from '@/components/ui/button'
import { Reveal, Stagger } from '@/components/motion/reveal'
import { getUpcomingEvents } from '@/lib/sanity/content'
import { resolveHref } from '@/lib/link'
import type { CtaValue, EventType } from '@/lib/sanity/types'

export type UpcomingEventsData = {
  heading?: string
  eventTypes?: EventType[]
  limit?: number
  cta?: CtaValue
}

export async function UpcomingEventsBlock({ data }: { data: UpcomingEventsData }) {
  let events = await getUpcomingEvents()
  if (data.eventTypes && data.eventTypes.length > 0) {
    events = events.filter((e) => data.eventTypes!.includes(e.eventType))
  }
  events = events.slice(0, data.limit ?? 3)

  if (events.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
      <div className="flex items-end justify-between">
        {data.heading && (
          <Reveal>
            <h2 className="font-display text-fg-heading text-3xl font-semibold">{data.heading}</h2>
          </Reveal>
        )}
        {data.cta?.link && (
          <ButtonLink
            href={resolveHref(data.cta.link)}
            variant="ghost"
            className="hidden sm:inline-flex"
          >
            {data.cta.link.label}
          </ButtonLink>
        )}
      </div>
      <Stagger className="mt-8 grid gap-6 sm:grid-cols-3">
        {events.map((event) => (
          <Reveal key={event._id}>
            <EventCard event={event} />
          </Reveal>
        ))}
      </Stagger>
      {data.cta?.link && (
        <ButtonLink
          href={resolveHref(data.cta.link)}
          variant="ghost"
          className="mt-6 w-full sm:hidden"
        >
          {data.cta.link.label}
        </ButtonLink>
      )}
    </section>
  )
}
