'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { isPastEvent } from '@/lib/events'
import { cn } from '@/lib/utils'
import type { EventRef } from '@/lib/sanity/types'
import { EventRsvpDialog } from './event-rsvp-dialog'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MAX_VISIBLE_PER_DAY = 3

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function dayKey(day: Date) {
  return day.toDateString()
}

/**
 * A real month grid — not a mini date-picker: each day cell shows the
 * events happening on it directly (as clickable chips), at full page
 * width. Clicking an event opens the RSVP dialog right there instead of
 * navigating away; "+N more" just expands that cell in place.
 */
export function EventCalendar({
  events,
  rsvpCounts,
}: {
  events: EventRef[]
  rsvpCounts: Record<string, number>
}) {
  const [cursor, setCursor] = useState(() => new Date())
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set())
  const [activeEvent, setActiveEvent] = useState<EventRef | null>(null)
  const today = useMemo(() => new Date(), [])

  const monthLabel = cursor.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  const days = useMemo(() => {
    const year = cursor.getFullYear()
    const month = cursor.getMonth()
    const firstOfMonth = new Date(year, month, 1)
    const startOffset = firstOfMonth.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const cells: (Date | null)[] = Array.from({ length: startOffset }, () => null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
    return cells
  }, [cursor])

  function eventsOnDay(day: Date) {
    return events
      .filter((e) => sameDay(new Date(e.startDateTime), day))
      .sort((a, b) => a.startDateTime.localeCompare(b.startDateTime))
  }

  function toggleExpanded(key: string) {
    setExpandedDays((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="rounded-card border-default w-full border p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          aria-label="Previous month"
          className="h-9 w-9 shrink-0 rounded-full p-0"
        >
          <Icon name="chevron-left" className="h-4 w-4" />
        </Button>
        <p className="font-display text-fg-heading text-lg font-semibold sm:text-xl">
          {monthLabel}
        </p>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          aria-label="Next month"
          className="h-9 w-9 shrink-0 rounded-full p-0"
        >
          <Icon name="chevron-right" className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-fg-subtle mt-5 grid grid-cols-7 gap-px text-center text-xs font-medium">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="border-default bg-default rounded-input mt-1 grid grid-cols-7 gap-px overflow-hidden border">
        {days.map((day, i) => {
          if (!day) return <div key={i} className="bg-canvas min-h-24 sm:min-h-32" />

          const key = dayKey(day)
          const dayEvents = eventsOnDay(day)
          const expanded = expandedDays.has(key)
          const visibleEvents = expanded ? dayEvents : dayEvents.slice(0, MAX_VISIBLE_PER_DAY)
          const overflow = dayEvents.length - visibleEvents.length
          const isToday = sameDay(day, today)

          return (
            <div
              key={i}
              className="bg-canvas flex min-h-24 flex-col gap-1 p-1.5 sm:min-h-32 sm:p-2"
            >
              <span
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center self-start rounded-full text-xs font-medium',
                  isToday ? 'bg-muted text-fg' : 'text-fg-subtle',
                )}
              >
                {day.getDate()}
              </span>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                {visibleEvents.map((event) => {
                  const past = isPastEvent(event.startDateTime)
                  return (
                    <button
                      key={event._id}
                      type="button"
                      onClick={() => setActiveEvent(event)}
                      title={`View details for ${event.title}${past ? ' (past event)' : ''}`}
                      className={cn(
                        'group flex items-center gap-1 rounded px-1.5 py-0.5 text-left transition-colors',
                        past
                          ? 'bg-muted hover:bg-muted/70'
                          : 'bg-accent-lagoon/15 hover:bg-accent-lagoon/30',
                      )}
                    >
                      {past && (
                        <span className="text-fg-subtle shrink-0 text-[9.5px] font-semibold tracking-[0.06em] uppercase">
                          Past
                        </span>
                      )}
                      <span
                        className={cn(
                          'min-w-0 flex-1 truncate text-[11px] font-medium',
                          past ? 'text-fg-muted' : 'text-lagoon-text',
                        )}
                      >
                        {event.title}
                      </span>
                      <Icon
                        name="chevron-right"
                        className={cn(
                          'h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-70',
                          past ? 'text-fg-muted' : 'text-lagoon-text',
                        )}
                      />
                    </button>
                  )
                })}
                {overflow > 0 && (
                  <button
                    type="button"
                    onClick={() => toggleExpanded(key)}
                    className="text-fg-subtle hover:text-fg px-1.5 text-left text-[11px] font-medium hover:underline"
                  >
                    +{overflow} more
                  </button>
                )}
                {expanded && dayEvents.length > MAX_VISIBLE_PER_DAY && (
                  <button
                    type="button"
                    onClick={() => toggleExpanded(key)}
                    className="text-fg-subtle hover:text-fg px-1.5 text-left text-[11px] font-medium hover:underline"
                  >
                    Show less
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <EventRsvpDialog
        event={activeEvent}
        rsvpCount={activeEvent ? rsvpCounts[activeEvent._id] : undefined}
        onOpenChange={(open) => !open && setActiveEvent(null)}
      />
    </div>
  )
}
