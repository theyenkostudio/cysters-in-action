'use client'

import { animate, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './use-reduced-motion'

/**
 * Exaggerated moment 4 (impact stats): counts up from 0 when it enters the
 * viewport. Under reduced motion, the final value appears immediately.
 */
export function CountUp({
  value,
  prefix = '',
  suffix = '',
  className,
}: {
  value: number
  prefix?: string
  suffix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reducedMotion = useReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (reducedMotion || !inView) return

    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })

    return () => controls.stop()
  }, [inView, reducedMotion, value])

  // Reading `value` directly here (not setting it into `display` from an
  // effect) matters: useReducedMotion reports `false` during SSR/hydration
  // regardless of the real preference, correcting itself client-side a
  // moment later — a stateful approach would need to catch that correction
  // and re-set the display value, but a plain render-time substitution is
  // always current and needs no effect to do it.
  return (
    <span ref={ref} className={className}>
      {prefix}
      {reducedMotion ? value : display}
      {suffix}
    </span>
  )
}
