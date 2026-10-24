import 'server-only'
import type { NextRequest } from 'next/server'

// Vercel Cron signs its requests with this header (Authorization: Bearer
// $CRON_SECRET) so the route can't be triggered by anyone who finds the URL.
// See https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs.
export function isAuthorizedCronRequest(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return req.headers.get('authorization') === `Bearer ${secret}`
}
