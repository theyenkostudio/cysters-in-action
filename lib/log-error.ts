/**
 * Structured error logging to stdout/stderr — captured automatically by
 * Vercel's log explorer, no extra account or dependency (Section 8:
 * "errors logged to Sentry (or Vercel logs) without personal data").
 *
 * `meta` is deliberately typed to primitives only: callers must never pass
 * user-entered content (name, email, message/story body) through it — a
 * form name, an event id, a status code are fine; the point of this helper
 * is that a log can never accidentally carry personal data.
 *
 * Works identically on the server and in the browser (no `server-only`
 * import), so it doubles as the reporter for app/error.tsx and
 * app/global-error.tsx.
 */
export function logError(
  scope: string,
  error: unknown,
  meta?: Record<string, string | number | boolean | undefined>,
) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error && 'message' in error
        ? String((error as { message: unknown }).message)
        : String(error)
  const stack = error instanceof Error ? error.stack : undefined

  console.error(
    JSON.stringify({
      level: 'error',
      scope,
      message,
      stack,
      ...meta,
      time: new Date().toISOString(),
    }),
  )
}
