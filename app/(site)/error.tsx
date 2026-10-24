'use client'

import { useEffect } from 'react'
import { ButtonLink } from '@/components/ui/button'
import { logError } from '@/lib/log-error'

// Catches errors thrown by any (site) page/component — the shell above it
// (app/(site)/layout.tsx: announcement bar, nav, footer) keeps rendering,
// since error.tsx only replaces the page's own content.
export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logError('client-boundary', error, { digest: error.digest })
  }, [error])

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-8">
      <h1 className="font-display text-fg-heading text-3xl font-semibold">Something went wrong</h1>
      <p className="text-fg-muted mt-3">
        We’ve logged the problem on our end. Try again, or head back to the homepage.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-pill bg-primary text-on-primary px-5 py-2 text-sm font-medium"
        >
          Try again
        </button>
        <ButtonLink href="/" variant="outline">
          Go home
        </ButtonLink>
      </div>
    </div>
  )
}
