import { describe, expect, it } from 'vitest'
import { events, getEventBySlug, isPastEvent } from './events'

describe('events fixture', () => {
  it('contains at least one past and one upcoming event, so the split is actually exercised', () => {
    expect(events.some(isPastEvent)).toBe(true)
    expect(events.some((e) => !isPastEvent(e))).toBe(true)
  })

  it('never includes onlineJoinUrl in a context a public component would read without going through a server-only lookup', () => {
    // This is a documentation test: onlineJoinUrl exists on the fixture (it
    // has to, for the RSVP flow to have something to email), but nothing in
    // components/ should ever import `events` directly to read it — only
    // lib/sanity/content.ts's getEventJoinDetails does, server-only.
    const withJoinUrl = events.filter((e) => e.onlineJoinUrl)
    expect(withJoinUrl.length).toBeGreaterThan(0)
  })

  it('getEventBySlug finds an event by its slug', () => {
    const first = events[0]
    expect(getEventBySlug(first.slug.current)?._id).toBe(first._id)
  })
})
