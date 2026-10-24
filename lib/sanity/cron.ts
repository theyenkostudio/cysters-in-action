import 'server-only'
import { hasSanityProject, writeClient } from './client'
import {
  attendingRsvpsForEventQuery,
  eventsNeeding1hReminderQuery,
  eventsNeeding24hReminderQuery,
  staleContactSubmissionIdsQuery,
  staleEventRsvpIdsQuery,
  staleRejectedStoryIdsQuery,
} from './queries'

// Server-only operational queries/writes for the Vercel Cron routes
// (app/api/cron/*). These read and mutate directly with the write token —
// unlike lib/sanity/content.ts's sanityFetch, there's nothing to render or
// cache here, and no fixture fallback: when no real Sanity project is
// configured there is nothing to remind or clean up, so callers check
// `hasSanityProject` first and skip the run entirely.

export type ReminderEventDetails = {
  _id: string
  title: string
  startDateTime: string
  endDateTime: string
  timezone: string
  onlineJoinUrl?: string
  format: string
  venueName?: string
}

export type RsvpRecipient = { name: string; email: string }

export function getEventsNeedingReminder(tier: 24 | 1, now: Date): Promise<ReminderEventDetails[]> {
  const windowStart = new Date(now)
  const windowEnd = new Date(now)
  if (tier === 24) {
    windowStart.setHours(windowStart.getHours() + 23)
    windowEnd.setHours(windowEnd.getHours() + 25)
  } else {
    windowEnd.setHours(windowEnd.getHours() + 1)
  }
  const query = tier === 24 ? eventsNeeding24hReminderQuery : eventsNeeding1hReminderQuery
  return writeClient.fetch(query, {
    windowStart: windowStart.toISOString(),
    windowEnd: windowEnd.toISOString(),
  })
}

export function getAttendingRsvps(eventId: string): Promise<RsvpRecipient[]> {
  return writeClient.fetch(attendingRsvpsForEventQuery, { eventId })
}

export function markReminderSent(eventId: string, tier: 24 | 1) {
  const field = tier === 24 ? 'reminder24hSentAt' : 'reminder1hSentAt'
  return writeClient
    .patch(eventId)
    .set({ [field]: new Date().toISOString() })
    .commit()
}

async function deleteByIds(ids: string[]) {
  if (ids.length === 0) return 0
  const tx = writeClient.transaction()
  for (const id of ids) tx.delete(id)
  await tx.commit()
  return ids.length
}

function monthsAgo(months: number, now: Date) {
  const d = new Date(now)
  d.setMonth(d.getMonth() - months)
  return d.toISOString()
}

function daysAgo(days: number, now: Date) {
  const d = new Date(now)
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

/** Section 7 retention rules: contact submissions 12mo, RSVPs 6mo after the
 * event, rejected stories 90 days — all deleted, not just unpublished. */
export async function runRetentionCleanup(now: Date = new Date()) {
  const [staleContactIds, staleRsvpIds, staleRejectedStoryIds] = await Promise.all([
    writeClient.fetch<string[]>(staleContactSubmissionIdsQuery, { cutoff: monthsAgo(12, now) }),
    writeClient.fetch<string[]>(staleEventRsvpIdsQuery, { cutoff: monthsAgo(6, now) }),
    writeClient.fetch<string[]>(staleRejectedStoryIdsQuery, { cutoff: daysAgo(90, now) }),
  ])

  const [contactSubmissionsDeleted, eventRsvpsDeleted, storiesDeleted] = await Promise.all([
    deleteByIds(staleContactIds),
    deleteByIds(staleRsvpIds),
    deleteByIds(staleRejectedStoryIds),
  ])

  return { contactSubmissionsDeleted, eventRsvpsDeleted, storiesDeleted }
}

export { hasSanityProject }
