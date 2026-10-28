import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { AddToCalendarMenu } from '@/components/connect/add-to-calendar-menu'
import { RsvpForm } from '@/components/connect/rsvp-form'
import { RichText } from '@/components/portable-text'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { ButtonLink } from '@/components/ui/button'
import { Reveal } from '@/components/motion/reveal'
import { isPastEvent } from '@/lib/events'
import { getAllEventSlugs, getEventBySlug, getEventRsvpCount } from '@/lib/sanity/content'
import { JsonLd, seoToMetadata, siteUrl } from '@/lib/seo'

const EVENT_TYPE_LABELS: Record<string, string> = {
  webinar: 'Webinar',
  meetup: 'Meetup',
  qna: 'Q&A',
  workshop: 'Workshop',
  other: 'Event',
}

export async function generateStaticParams() {
  const slugs = await getAllEventSlugs()
  return slugs.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return {}
  return seoToMetadata(
    event.seo,
    { title: event.title, description: event.summary },
    `/connect/events/${slug}`,
  )
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) notFound()

  const past = isPastEvent(event.startDateTime)
  const rsvpCount = await getEventRsvpCount(event._id)
  const capacityRemaining =
    typeof event.capacity === 'number' ? Math.max(event.capacity - rsvpCount, 0) : undefined

  const date = new Date(event.startDateTime).toLocaleString('en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: event.timezone,
  })
  const pageUrl = `${siteUrl}/connect/events/${slug}`

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: event.title,
          startDate: event.startDateTime,
          endDate: event.endDateTime,
          eventAttendanceMode:
            event.format === 'online'
              ? 'https://schema.org/OnlineEventAttendanceMode'
              : event.format === 'hybrid'
                ? 'https://schema.org/MixedEventAttendanceMode'
                : 'https://schema.org/OfflineEventAttendanceMode',
          eventStatus:
            event.status === 'cancelled'
              ? 'https://schema.org/EventCancelled'
              : event.status === 'postponed'
                ? 'https://schema.org/EventPostponed'
                : 'https://schema.org/EventScheduled',
          location:
            event.format === 'online'
              ? { '@type': 'VirtualLocation', url: pageUrl }
              : { '@type': 'Place', name: event.venue?.name },
          description: event.summary,
          url: pageUrl,
        }}
      />

      <Breadcrumb items={[{ label: 'Events', href: '/connect/events' }, { label: event.title }]} />

      {event.status !== 'scheduled' && (
        <div className="rounded-card bg-warning-bg text-warning-text mt-4 p-3 text-sm font-medium">
          This event has been {event.status}.
        </div>
      )}

      {event.image && (
        <Reveal className="mt-6">
          <div className="rounded-card relative aspect-video overflow-hidden">
            <Image
              src={event.image.url}
              alt={event.image.alt}
              fill
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      )}

      <Reveal className="mt-6">
        <div className="flex items-center gap-2">
          <Badge>{EVENT_TYPE_LABELS[event.eventType]}</Badge>
          <Badge tone="neutral">
            {event.format === 'inPerson'
              ? 'In person'
              : event.format === 'hybrid'
                ? 'Hybrid'
                : 'Online'}
          </Badge>
        </div>
        <h1 className="font-display text-fg-heading mt-4 text-4xl font-semibold">{event.title}</h1>
        <p className="text-fg-muted mt-3">
          {date} ({event.timezone})
        </p>
        {event.venue?.name && !past && (
          <p className="text-fg-muted mt-1">
            {event.venue.name}
            {event.venue.mapUrl && (
              <>
                {' · '}
                <a href={event.venue.mapUrl} className="text-fg-link underline">
                  Map
                </a>
              </>
            )}
          </p>
        )}
      </Reveal>

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_320px]">
        <Reveal>
          {event.description && <RichText value={event.description} />}
          {event.hosts && event.hosts.length > 0 && (
            <div className="mt-8">
              <p className="text-fg-subtle text-sm font-semibold tracking-wide uppercase">
                Hosted by
              </p>
              <p className="text-fg mt-1">{event.hosts.map((h) => h.name).join(', ')}</p>
            </div>
          )}
          {past && event.recordingUrl && (
            <ButtonLink href={event.recordingUrl} variant="solid" className="mt-8">
              Watch the recording
            </ButtonLink>
          )}
        </Reveal>

        {!past && event.status === 'scheduled' && (
          <div className="rounded-card border-default border p-6">
            {event.rsvpEnabled === false ? (
              <p className="text-fg-muted">RSVPs are closed for this event.</p>
            ) : event.rsvpMode === 'external' && event.externalRsvpUrl ? (
              <ButtonLink href={event.externalRsvpUrl} variant="solid" className="w-full">
                RSVP
              </ButtonLink>
            ) : (
              <>
                <RsvpForm event={event} capacityRemaining={capacityRemaining} />
                <div className="border-default mt-6 border-t pt-6">
                  <AddToCalendarMenu event={event} />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
