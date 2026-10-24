import 'server-only'
import { logError } from '@/lib/log-error'

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/**
 * Verifies a Cloudflare Turnstile token server-side. When
 * TURNSTILE_SECRET_KEY is unset (local dev, this scaffold), verification is
 * skipped and every submission passes — the widget itself also doesn't
 * render client-side without a site key (components/forms/turnstile-widget.tsx).
 */
export async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.warn('[turnstile] TURNSTILE_SECRET_KEY is not set — skipping verification.')
    return true
  }
  if (!token) return false

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
    })
    const data = (await res.json()) as { success: boolean }
    return data.success
  } catch (err) {
    logError('turnstile', err)
    return false
  }
}
