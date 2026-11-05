'use client'

import { useEffect } from 'react'

/**
 * Locks page scroll while `active` is true — for any dialog/sheet that sits
 * over the page (event RSVP quick-view, founding member bio). Two separate
 * scroll mechanisms both have to be dealt with, not just one: 1) Lenis
 * (components/motion/lenis-provider.tsx) drives smooth scroll itself from a
 * global wheel/touch listener, entirely independent of CSS `overflow` — so
 * `lenis.stop()` is what actually stops it, not a style change. 2) Radix's
 * own scroll lock targets document.body, but this site scrolls at the
 * <html> level (deliberately, for position: sticky — see globals.css), so
 * that lock alone does nothing. Locking html directly covers native/
 * non-Lenis scrolling once Lenis is stopped.
 */
export function useLenisScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    window.__lenis?.stop()
    const html = document.documentElement
    const previousOverflow = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      window.__lenis?.start()
      html.style.overflow = previousOverflow
    }
  }, [active])
}
