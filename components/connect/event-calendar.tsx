'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { EventRef } from '@/lib/sanity/types'

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function EventCalendar({
  events,
  onSelectDay,
}: {
  events: EventRef[]
  onSelectDay?: (day: Date | null) => void
}) {
  const [cursor, setCursor] = useState(() => new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

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
    return events.filter((e) => sameDay(new Date(e.startDateTime), day))
  }

  function selectDay(day: Date) {
    const next = selectedDay && sameDay(selectedDay, day) ? null : day
    setSelectedDay(next)
    onSelectDay?.(next)
  }

  return (
    <div className="rounded-card border-default border p-4">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          aria-label="Previous month"
        >
          ←
        </Button>
        <p className="font-display text-fg-heading font-semibold">{monthLabel}</p>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          aria-label="Next month"
        >
          →
        </Button>
      </div>

      <div className="text-fg-subtle mt-4 grid grid-cols-7 gap-1 text-center text-xs">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (!day) return <div key={i} />
          const dayEvents = eventsOnDay(day)
          const isSelected = selectedDay && sameDay(selectedDay, day)
          return (
            <button
              key={i}
              type="button"
              disabled={dayEvents.length === 0}
              onClick={() => selectDay(day)}
              className={cn(
                'relative aspect-square rounded-lg text-sm',
                dayEvents.length > 0 ? 'text-fg hover:bg-muted' : 'text-fg-subtle',
                isSelected && 'bg-primary text-on-primary hover:bg-primary',
              )}
            >
              {day.getDate()}
              {dayEvents.length > 0 && (
                <span
                  aria-hidden
                  className={cn(
                    'absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full',
                    isSelected ? 'bg-on-primary' : 'bg-accent-lagoon',
                  )}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
