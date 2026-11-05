'use client'

import * as Dialog from '@radix-ui/react-dialog'
import NextLink from 'next/link'
import { AddToCalendarMenu } from './add-to-calendar-menu'
import { RsvpForm } from './rsvp-form'
import { Badge } from '@/components/ui/badge'
import { ButtonLink } from '@/components/ui/button'
import { useLenisScrollLock } from '@/components/motion/use-lenis-scroll-lock'
import { isPastEvent } from '@/lib/events'
import type { EventRef } from '@/lib/sanity/types'

const EVENT_TYPE_LABELS: Record<string, string> = {
  webinar: 'Webinar',
  meetup: 'Meetup',
  qna: 'Q&A',
  workshop: 'Workshop',
  other: 'Event',
}

/**
 * The calendar's own quick-view/RSVP — clicking an event there opens this
 * instead of navigating to the full event page, so picking a date and
 * RSVPing never leaves the calendar.
 */
export function EventRsvpDialog({
  event,
  rsvpCount,
  onOpenChange,
}: {
  event: EventRef | null
  rsvpCount?: number
  onOpenChange: (open: boolean) => void
}) {
  useLenisScrollLock(event !== null)

  return (
    <Dialog.Root open={event !== null} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-dialog-overlay fixed inset-0 z-50 bg-black/40" />
        {/* The frame (fixed, positioned, max-height) and the scroll region
            are deliberately separate elements — putting overflow-y-auto
            directly on the positioned/transformed element was clipping
            content with no visible way to scroll to it. Here the frame
            only sizes and positions the dialog; the inner div is the only
            thing that scrolls, and the close button sits outside it so it
            stays put regardless of scroll position.

            Below `sm`, it's pinned to the bottom edge as a full-width sheet
            (top corners only); at `sm` and up it's the original centered
            dialog, now with a gentle fade/scale instead of popping in. */}
        <Dialog.Content className="sheet-dialog-panel bg-canvas rounded-t-dialog sm:rounded-dialog fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] w-full flex-col pb-[env(safe-area-inset-bottom)] shadow-lg sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-[min(36rem,94vw)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:pb-0">
          {/* data-lenis-prevent: tells Lenis to ignore wheel/touch here and
              leave it to native overflow scrolling — without it, Lenis's
              global listener keeps trying to scroll the page even when the
              cursor is over this div. */}
          <div
            data-lenis-prevent
            className="scrollbar-hide min-h-0 flex-1 overflow-y-auto p-6 sm:p-8"
          >
            {event && <EventRsvpDialogContent event={event} rsvpCount={rsvpCount} />}
          </div>
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close"
              className="text-fg-muted hover:text-fg bg-canvas absolute top-4 right-4 rounded-full p-1"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function EventRsvpDialogContent({ event, rsvpCount }: { event: EventRef; rsvpCount?: number }) {
  const past = isPastEvent(event.startDateTime)
  const capacityRemaining =
    typeof event.capacity === 'number' && typeof rsvpCount === 'number'
      ? Math.max(event.capacity - rsvpCount, 0)
      : undefined
  const date = new Date(event.startDateTime).toLocaleString('en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: event.timezone,
  })

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 pr-8">
        {past && <Badge tone="neutral">Past event</Badge>}
        <Badge>{EVENT_TYPE_LABELS[event.eventType]}</Badge>
        <Badge tone="neutral">
          {event.format === 'inPerson'
            ? 'In person'
            : event.format === 'hybrid'
              ? 'Hybrid'
              : 'Online'}
        </Badge>
      </div>
      <Dialog.Title className="font-display text-fg-heading mt-3 text-2xl font-semibold">
        {event.title}
      </Dialog.Title>
      <Dialog.Description className="text-fg-muted mt-2 text-sm">
        {date} ({event.timezone})
      </Dialog.Description>
      {event.venue?.name && !past && (
        <p className="text-fg-muted mt-1 text-sm">
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

      {event.summary && <p className="text-fg mt-4 text-sm leading-relaxed">{event.summary}</p>}

      {past ? (
        <div className="border-default mt-6 border-t pt-6">
          {event.recordingUrl ? (
            <ButtonLink href={event.recordingUrl} variant="solid" className="w-full">
              Watch the recording
            </ButtonLink>
          ) : (
            <p className="text-fg-muted text-sm">This event has already happened.</p>
          )}
        </div>
      ) : event.status !== 'scheduled' ? (
        <p className="rounded-card bg-warning-bg text-warning-text mt-6 p-3 text-sm font-medium">
          This event has been {event.status}.
        </p>
      ) : (
        <div className="border-default mt-6 border-t pt-6">
          {event.rsvpEnabled === false ? (
            <p className="text-fg-muted text-sm">RSVPs are closed for this event.</p>
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

      <NextLink
        href={`/connect/events/${event.slug.current}`}
        className="text-fg-link mt-5 inline-block text-sm underline"
      >
        View full event page
      </NextLink>
    </div>
  )
}
