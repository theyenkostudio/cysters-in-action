'use client'

import Script from 'next/script'
import { useId, useState } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string
          callback: (token: string) => void
          'error-callback'?: () => void
        },
      ) => string
    }
  }
}

/**
 * Renders nothing (and the form proceeds un-verified, per lib/forms/turnstile.ts's
 * server-side skip) when NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset.
 */
export function TurnstileWidget({ onToken }: { onToken: (token: string) => void }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const containerId = useId().replace(/:/g, '')
  const [scriptLoaded, setScriptLoaded] = useState(false)

  if (!siteKey) return null

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        onReady={() => {
          setScriptLoaded(true)
          window.turnstile?.render(`#${containerId}`, { sitekey: siteKey, callback: onToken })
        }}
      />
      <div id={containerId} data-loaded={scriptLoaded} />
    </>
  )
}
