import { EventsLedger } from '@/components/connect/events-ledger'
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
    <EventsLedger
      events={events}
      heading={data.heading}
      cta={
        data.cta?.link
          ? { label: data.cta.link.label, href: resolveHref(data.cta.link) }
          : undefined
      }
    />
  )
}
