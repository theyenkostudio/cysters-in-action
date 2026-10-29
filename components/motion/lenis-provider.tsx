'use client'

import gsap from 'gsap'
import Lenis from 'lenis'
import { useEffect } from 'react'
import { useReducedMotion } from './use-reduced-motion'

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

/** Smooth scroll with light inertia (Section 4). Disabled under reduced motion. */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false, autoRaf: false })
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
