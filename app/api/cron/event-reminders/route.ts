import { NextRequest, NextResponse } from 'next/server'
import { EventReminderEmail } from '@/lib/email/templates/event-reminder'
import { sendEmail } from '@/lib/email/send'
import { isAuthorizedCronRequest } from '@/lib/cron-auth'
import {
  getAttendingRsvps,
  getEventsNeedingReminder,
  hasSanityProject,
  markReminderSent,
  type ReminderEventDetails,
} from '@/lib/sanity/cron'

// Vercel Cron (vercel.json), hourly: sends the 24h and 1h event reminders
// from Section 7. Each event is only ever matched by one run per tier —
// the window check plus reminder{24h,1h}SentAt together make this
// idempotent against retries or an overlapping run.
export const dynamic = 'force-dynamic'

async function sendReminders(tier: 24 | 1, now: Date) {
  const events = await getEventsNeedingReminder(tier, now)
  let emailsSent = 0

  for (const event of events) {
    const recipients = await getAttendingRsvps(event._id)
    await Promise.all(
      recipients.map((r) =>
        sendEmail({
          to: r.email,
          subject:
            tier === 24 ? `Reminder: ${event.title} is tomorrow` : `Starting soon: ${event.title}`,
          react: EventReminderEmail({
            name: r.name,
            eventTitle: event.title,
            startDateTime: event.startDateTime,
            timezone: event.timezone,
            joinUrl: event.format !== 'inPerson' ? event.onlineJoinUrl : undefined,
            venueName: event.venueName,
            hoursBefore: tier,
          }),
        }),
      ),
    )
    await markReminderSent(event._id, tier)
    emailsSent += recipients.length
  }

  return { events: events.map((e: ReminderEventDetails) => e._id), emailsSent }
}

export async function GET(req: NextRequest) {
  if (!isAuthorizedCronRequest(req)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  if (!hasSanityProject) {
    return NextResponse.json({ skipped: 'no Sanity project configured' })
  }

  const now = new Date()
  const [reminder24h, reminder1h] = await Promise.all([
    sendReminders(24, now),
    sendReminders(1, now),
  ])

  return NextResponse.json({ reminder24h, reminder1h })
}
