'use client'

import { useEffect } from 'react'
import { logError } from '@/lib/log-error'

// Only catches errors thrown by the ROOT layout itself (app/layout.tsx) —
// everything else is caught by app/(site)/error.tsx. Since this replaces
// the root layout entirely, it renders its own <html>/<body> and stays
// deliberately plain (no Tailwind classes, no theme CSS): if the root
// layout broke, globals.css may not have loaded either.
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    logError('global-boundary', error, { digest: error.digest })
  }, [error])

  return (
    <html lang="en">
      <body style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '4rem 1rem' }}>
        <h1>Something went wrong</h1>
        <p>We’ve logged the problem. Please refresh the page.</p>
      </body>
    </html>
  )
}
