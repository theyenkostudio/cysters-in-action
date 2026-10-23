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
  const [display, setDisplay] = useState(reducedMotion ? value : 0)

  useEffect(() => {
    // Under reduced motion `display` already starts at `value` (lazy init below).
    if (!inView || reducedMotion) return

    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })

    return () => controls.stop()
  }, [inView, reducedMotion, value])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
