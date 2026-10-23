import { NextRequest, NextResponse } from 'next/server'
import { verifyWithdrawToken } from '@/lib/forms/withdraw-token'
import { sanityPatch } from '@/lib/sanity/write'

// The "request removal" link from the story confirmation email. Section 7:
// "removal sets status `withdrawn` and unpublishes." Sanity's `patch` on a
// published document only affects the draft until re-published — for a
// story, `status != "approved"` already removes it from every public query,
// which is the unpublish behaviour that matters here.
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  const token = req.nextUrl.searchParams.get('token')

  if (!id || !token || !verifyWithdrawToken(id, token)) {
    return new NextResponse('This link is invalid or has expired.', { status: 400 })
  }

  await sanityPatch(id, { status: 'withdrawn' })

  return new NextResponse(
    '<!doctype html><html><body style="font-family: sans-serif; padding: 2rem;"><h1>Your story has been withdrawn.</h1><p>It will no longer appear on the site. Thank you for sharing it with us.</p></body></html>',
    { headers: { 'Content-Type': 'text/html' } },
  )
}
