'use client'

import { useMemo, useState } from 'react'
import { EventCalendar } from './event-calendar'
import { EventCard } from './event-card'
import { cn } from '@/lib/utils'
import type { EventRef, EventType } from '@/lib/sanity/types'

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  webinar: 'Webinars',
  meetup: 'Meetups',
  qna: 'Q&A',
  workshop: 'Workshops',
  other: 'Other',
}

export function EventsListing({ events }: { events: EventRef[] }) {
  const [typeFilter, setTypeFilter] = useState<EventType | 'all'>('all')
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [calendarDay, setCalendarDay] = useState<Date | null>(null)

  const types = useMemo(() => Array.from(new Set(events.map((e) => e.eventType))), [events])

  const byType = typeFilter === 'all' ? events : events.filter((e) => e.eventType === typeFilter)
  const visible = calendarDay
    ? byType.filter((e) => new Date(e.startDateTime).toDateString() === calendarDay.toDateString())
    : byType

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        {types.length > 1 && (
          <div
            role="group"
            aria-label="Filter events by type"
            className="rounded-pill border-default flex gap-1 border p-1"
          >
            <button
              type="button"
              aria-pressed={typeFilter === 'all'}
              onClick={() => setTypeFilter('all')}
              className={cn(
                'rounded-pill px-3 py-1.5 text-sm font-medium',
                typeFilter === 'all' ? 'bg-primary text-on-primary' : 'text-fg',
              )}
            >
              All
            </button>
            {types.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={typeFilter === t}
                onClick={() => setTypeFilter(t)}
                className={cn(
                  'rounded-pill px-3 py-1.5 text-sm font-medium',
                  typeFilter === t ? 'bg-primary text-on-primary' : 'text-fg',
                )}
              >
                {EVENT_TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        )}

        <div className="rounded-pill border-default flex gap-1 border p-1">
          <button
            type="button"
            onClick={() => setView('list')}
            className={cn(
              'rounded-pill px-3 py-1.5 text-sm font-medium',
              view === 'list' ? 'bg-primary text-on-primary' : 'text-fg',
            )}
          >
            List
          </button>
          <button
            type="button"
            onClick={() => setView('calendar')}
            className={cn(
              'rounded-pill px-3 py-1.5 text-sm font-medium',
              view === 'calendar' ? 'bg-primary text-on-primary' : 'text-fg',
            )}
          >
            Calendar
          </button>
        </div>
      </div>

      {view === 'calendar' && (
        <div className="mt-6 max-w-sm">
          <EventCalendar events={byType} onSelectDay={setCalendarDay} />
        </div>
      )}

      {visible.length === 0 ? (
        <p className="text-fg-muted mt-10">No events match these filters right now.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {visible.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
