'use client'

import gsap from 'gsap'
import Lenis from 'lenis'
import { useEffect, useLayoutEffect } from 'react'
import { useReducedMotion } from './use-reduced-motion'

// SSR has no `window`, where useLayoutEffect's synchronous-before-paint
// behavior is unavailable and React warns if it's used; useEffect is the
// fallback there. In the browser this runs Lenis's setup (and attaches its
// wheel/touch listeners) before first paint instead of after, so there's no
// gap where a user's first scroll input lands before Lenis is listening.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

declare global {
  interface Window {
    // Exposed so route-scoped ScrollTrigger consumers (e.g. WaysWeShowUp's
    // shuffle timeline) can hook `lenis.on('scroll', ScrollTrigger.update)`.
    // Lenis itself is ticked by gsap.ticker below, so there is exactly one
    // rAF loop on the page regardless of how many of those consumers mount.
    __lenis?: Lenis
  }
}

// gsap core only (no ScrollTrigger/SplitText) — a static import here, not a
// dynamic one, because this provider mounts on every page via SiteLayout and
// Lenis needs a tick source immediately. Core gsap is a few KB; the heavy
// plugins stay dynamically imported in the components that actually use them.
gsap.ticker.lagSmoothing(0)
// GSAP auto-sleeps its shared ticker (stops its rAF entirely) once its root
// timeline has had no active tweens for ~120 frames AND the ticker has fewer
// than 2 listeners (gsap-core.js's `Timeline.updateRoot`). Lenis's tick below
// is often the ONLY listener once a page's GSAP entrance/scrub animations have
// finished — e.g. once the user has scrolled past every animated section into
// the footer — so without this, autoSleep silently kills the ticker Lenis
// depends on and scrolling sticks. Lenis needs to tick forever, so this must
// never sleep.
gsap.config({ autoSleep: 0 })

/** Smooth scroll with light inertia (Section 4). Disabled under reduced motion. */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion()

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion) return

    const lenis = new Lenis({ lerp: 0.3, smoothWheel: true, syncTouch: false, autoRaf: false })
    window.__lenis = lenis

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      if (window.__lenis === lenis) window.__lenis = undefined
    }
  }, [reducedMotion])

  return <>{children}</>
}
