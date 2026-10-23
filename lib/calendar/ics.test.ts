// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { buildIcsFile } from './ics'

describe('buildIcsFile', () => {
  it('produces a VCALENDAR with the right UTC start/end and no local-timezone drift', () => {
    const ics = buildIcsFile({
      title: 'Test Event',
      description: 'A test description',
      location: 'Online',
      startDateTime: '2026-11-02T18:00:00.000Z',
      endDateTime: '2026-11-02T19:00:00.000Z',
    })

    expect(ics).toContain('BEGIN:VCALENDAR')
    expect(ics).toContain('BEGIN:VEVENT')
    expect(ics).toContain('SUMMARY:Test Event')
    // The `ics` package renders UTC instants as DTSTART/DTEND with a Z suffix.
    expect(ics).toMatch(/DTSTART:20261102T180000Z/)
    expect(ics).toMatch(/DTEND:20261102T190000Z/)
    expect(ics).toContain('END:VEVENT')
    expect(ics).toContain('END:VCALENDAR')
  })

  it('throws rather than silently returning an invalid file when end is before start', () => {
    expect(() =>
      buildIcsFile({
        title: 'Broken Event',
        startDateTime: '2026-11-02T19:00:00.000Z',
        endDateTime: '2026-11-02T18:00:00.000Z',
      }),
    ).toThrow()
  })
})
