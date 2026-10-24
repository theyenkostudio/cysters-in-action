import { NextResponse } from 'next/server'

// Section 8's "uptime check" — point an external monitor (UptimeRobot,
// Better Stack, Checkly, ...) at this URL; setting up the actual
// ping-on-an-interval-and-alert account is a one-off ops task outside the
// repo. Deliberately checks only that the app itself can respond — not
// Sanity, email or Turnstile — so a third-party outage doesn't flip the
// site's own uptime status to "down" when cached content is still serving.
export function GET() {
  return NextResponse.json({ status: 'ok', time: new Date().toISOString() })
}
