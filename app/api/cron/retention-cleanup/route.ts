import { NextRequest, NextResponse } from 'next/server'
import { isAuthorizedCronRequest } from '@/lib/cron-auth'
import { hasSanityProject, runRetentionCleanup } from '@/lib/sanity/cron'

// Vercel Cron (vercel.json), daily: Section 7's data-retention rules —
// contact submissions 12 months, event RSVPs 6 months after the event,
// rejected stories 90 days. Deletes outright rather than unpublishing.
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!isAuthorizedCronRequest(req)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  if (!hasSanityProject) {
    return NextResponse.json({ skipped: 'no Sanity project configured' })
  }

  const result = await runRetentionCleanup()
  return NextResponse.json(result)
}
