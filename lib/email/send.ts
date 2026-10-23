import 'server-only'
import { Resend } from 'resend'
import type { ReactElement } from 'react'

const FROM_ADDRESS = 'Cysters In Action <notifications@cystersinaction.org>'

/**
 * Sends a transactional email via Resend (Section 7). Logs instead of
 * sending when RESEND_API_KEY is unset — forms still complete locally
 * without a real account.
 */
export async function sendEmail({
  to,
  subject,
  react,
  replyTo,
}: {
  to: string
  subject: string
  react: ReactElement
  replyTo?: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.log(`[email] would send "${subject}" to ${to} — RESEND_API_KEY is not set.`)
    return
  }

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({ from: FROM_ADDRESS, to, subject, react, replyTo })
  if (error) {
    console.error('[email] Resend send failed', error)
  }
}
