'use client'

import { useSyncExternalStore } from 'react'

/**
 * Generic `matchMedia` hook, SSR-safe the same way as useReducedMotion:
 * always `false` until hydration (matching what the server rendered), then
 * the real value via useSyncExternalStore's getServerSnapshot contract —
 * see the long comment in use-reduced-motion.ts for why that specific
 * shape (not useState+useEffect) avoids a hydration mismatch.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}
