'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'
import { useReducedMotion } from './use-reduced-motion'

declare global {
  interface Window {
    // Exposed so route-scoped ScrollTrigger consumers (e.g. WaysWeShowUp's
    // shuffle timeline) can hook `lenis.on('scroll', ScrollTrigger.update)`
    // without this provider depending on GSAP. Lenis keeps driving its own
    // rAF loop below regardless — this is read-only for other components.
    __lenis?: Lenis
  }
}

/** Smooth scroll with light inertia (Section 4). Disabled under reduced motion. */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const lenis = new Lenis({ lerp: 0.12 })
    window.__lenis = lenis

    let frameId: number
    function raf(time: number) {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }
    frameId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frameId)
      lenis.destroy()
      if (window.__lenis === lenis) window.__lenis = undefined
    }
  }, [reducedMotion])

  return <>{children}</>
}
