import NextLink from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardImage } from '@/components/ui/card'
import type { EventRef } from '@/lib/sanity/types'

const EVENT_TYPE_LABELS: Record<string, string> = {
  webinar: 'Webinar',
  meetup: 'Meetup',
  qna: 'Q&A',
  workshop: 'Workshop',
  other: 'Event',
}

export function EventCard({ event }: { event: EventRef }) {
  const date = new Date(event.startDateTime).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: event.timezone,
  })

  return (
    <Card>
      <NextLink href={`/connect/events/${event.slug.current}`} className="block">
        {event.image && <CardImage src={event.image.url} alt={event.image.alt} />}
        <div className="p-5">
          <div className="flex items-center gap-2">
            <Badge>{EVENT_TYPE_LABELS[event.eventType]}</Badge>
            {event.status !== 'scheduled' && <Badge tone="warning">{event.status}</Badge>}
          </div>
          <h3 className="font-display text-fg-heading mt-2 text-lg font-semibold">{event.title}</h3>
          <p className="text-fg-muted mt-1 text-sm">{date}</p>
          {event.summary && <p className="text-fg-muted mt-2 text-sm">{event.summary}</p>}
        </div>
      </NextLink>
    </Card>
  )
}
