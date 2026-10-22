'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'
import { useReducedMotion } from './use-reduced-motion'

/** Smooth scroll with light inertia (Section 4). Disabled under reduced motion. */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const lenis = new Lenis({ lerp: 0.12 })

    let frameId: number
    function raf(time: number) {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }
    frameId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frameId)
      lenis.destroy()
    }
  }, [reducedMotion])

  return <>{children}</>
}
