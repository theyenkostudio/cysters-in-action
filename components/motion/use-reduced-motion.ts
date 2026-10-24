'use client'

import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches
}

// There's no `window` on the server, and no real preference to report yet
// anyway — this is also exactly what the first CLIENT render must return
// (useSyncExternalStore calls this, not getSnapshot, until hydration
// completes), so server and client agree on the first paint. Reading
// matchMedia synchronously client-side instead (the previous
// implementation, via useState's lazy initializer) let a real
// reduced-motion user's first client render disagree with the server's —
// a genuine hydration mismatch, not just a lint nit: React discards the
// server-rendered tree and regenerates it, so anything relying on that
// first paint (a non-React script, a screenshot, a layout measurement)
// briefly saw the wrong, non-reduced-motion markup.
function getServerSnapshot() {
  return false
}

/**
 * Global `prefers-reduced-motion` flag. Motion components read this to strip
 * transforms, cap fade durations at ~200ms, and keep hero video paused on
 * its poster (Section 4, Motion principles #3).
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
