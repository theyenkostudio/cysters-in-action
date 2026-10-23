import 'server-only'
import { createEvent } from 'ics'

export type IcsEventInput = {
  title: string
  description?: string
  location?: string
  url?: string
  startDateTime: string
  endDateTime: string
}

function toUtcParts(iso: string): [number, number, number, number, number] {
  const d = new Date(iso)
  return [
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
  ]
}

/**
 * Builds a .ics file. `startDateTime`/`endDateTime` are stored as absolute
 * UTC instants (standard ISO 8601), so converting to UTC parts here and
 * marking `startInputType: 'utc'` produces a DTSTART every calendar app
 * localises correctly — no IANA TZID wrangling needed (Section 7: "Times
 * converted using the event's timezone").
 */
export function buildIcsFile(event: IcsEventInput): string {
  // The `ics` package doesn't validate this itself — it'll happily emit a
  // calendar entry with DTEND before DTSTART, which some calendar apps then
  // fail to import at all.
  if (new Date(event.endDateTime).getTime() <= new Date(event.startDateTime).getTime()) {
    throw new Error('endDateTime must be after startDateTime')
  }

  const { error, value } = createEvent({
    title: event.title,
    description: event.description,
    location: event.location,
    url: event.url,
    start: toUtcParts(event.startDateTime),
    startInputType: 'utc',
    end: toUtcParts(event.endDateTime),
    endInputType: 'utc',
  })

  if (error || !value) {
    throw error ?? new Error('Failed to build .ics file')
  }
  return value
}
