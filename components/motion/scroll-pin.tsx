'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from './use-reduced-motion'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Exaggerated moment 3 (pillars): pins the section while its children fan
 * in and stack, each tinting the background as it takes over. Renders
 * children in a plain stacked grid with no pinning under reduced motion.
 */
export function ScrollPin({
  children,
  className,
}: {
  children: React.ReactNode[]
  className?: string
}) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return

    const panels = Array.from(sectionRef.current.querySelectorAll<HTMLElement>('[data-pin-panel]'))
    const triggers: ScrollTrigger[] = []

    panels.forEach((panel, i) => {
      if (i === 0) return
      gsap.set(panel, { yPercent: 100, opacity: 0 })
    })

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${panels.length * 60}%`,
        scrub: 0.5,
        pin: true,
      },
    })

    panels.forEach((panel, i) => {
      if (i === 0) return
      timeline.to(panel, { yPercent: 0, opacity: 1, duration: 1 }, i - 1)
    })

    if (timeline.scrollTrigger) triggers.push(timeline.scrollTrigger)

    return () => {
      timeline.kill()
      triggers.forEach((t) => t.kill())
    }
  }, [reducedMotion])

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <div ref={sectionRef} className={className}>
      <div className="relative h-[70vh] min-h-[480px]">
        {children.map((child, i) => (
          <div key={i} data-pin-panel className="absolute inset-0">
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}
