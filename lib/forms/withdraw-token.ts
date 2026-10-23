import 'server-only'
import { createHmac } from 'node:crypto'

// Lets a "request removal" link in the story confirmation email work
// without requiring a login (Section 7: "each confirmation email includes
// a link to request removal"). Reuses the webhook secret as the signing
// key — low-stakes (worst case of a forged token is withdrawing one's own
// just-submitted, not-yet-public story), so a dedicated secret isn't
// warranted.
const SECRET = process.env.SANITY_REVALIDATE_SECRET || 'dev-only-insecure-secret'

export function createWithdrawToken(storyId: string): string {
  return createHmac('sha256', SECRET).update(storyId).digest('hex')
}

export function verifyWithdrawToken(storyId: string, token: string): boolean {
  return createWithdrawToken(storyId) === token
}
