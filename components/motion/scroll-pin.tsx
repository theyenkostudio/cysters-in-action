'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from './use-reduced-motion'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
  ScrollTrigger.config({ ignoreMobileResize: true })
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
      const backdrop = panel.querySelector('[data-pin-backdrop]')
      const content = panel.querySelector('[data-pin-content]')
      const image = panel.querySelector('[data-pin-image]')
      const overlay = panel.querySelector('[data-pin-overlay]')
      // A clip-path wipe on the backdrop only (not the whole panel, and not
      // yPercent + opacity) so the incoming panel's own text is never
      // caught mid-clip through its own glyphs — see the note on
      // PillarPanel for why content has to stay a separate, unclipped
      // sibling of the backdrop.
      if (backdrop) gsap.set(backdrop, { clipPath: 'inset(100% 0% 0% 0%)' })
      if (content) gsap.set(content, { opacity: 0 })
      // Inactive resting state: desaturated image under a near-opaque
      // plum wash. GSAP owns this from the start (not a pre-authored CSS
      // class) so there's no conflicting value for it to fight when the
      // tween below takes over — see the note on PillarPanel.
      if (image) gsap.set(image, { filter: 'grayscale(100%)' })
      if (overlay) gsap.set(overlay, { backgroundColor: 'rgba(48, 13, 47, 0.85)' })
    })

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        // Pins once the section itself is centred in the viewport (fully
        // in focus), not once its top edge reaches the very top of the
        // viewport — "top top" only fired after scrolling past most of the
        // section already.
        start: 'center center',
        end: `+=${panels.length * 60}%`,
        scrub: 0.5,
        pin: true,
      },
    })

    panels.forEach((panel, i) => {
      if (i === 0) return
      const backdrop = panel.querySelector('[data-pin-backdrop]')
      const content = panel.querySelector('[data-pin-content]')
      const image = panel.querySelector('[data-pin-image]')
      const overlay = panel.querySelector('[data-pin-overlay]')
      if (backdrop) {
        timeline.to(backdrop, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'none' }, i - 1)
      }
      // Becomes the "active" card as it takes over the stack: full colour
      // under a lighter purple wash, matching PillarPanel's `active` resting
      // state for panel 0. Tracks the backdrop reveal exactly.
      if (image) timeline.to(image, { filter: 'grayscale(0%)', duration: 1 }, i - 1)
      if (overlay) {
        timeline.to(overlay, { backgroundColor: 'rgba(78, 31, 76, 0.45)', duration: 1 }, i - 1)
      }
      // The text itself only fades in late, once the backdrop has already
      // covered the panel underneath — a quick, all-or-nothing step rather
      // than something scrubbed gradually in step with the clip.
      if (content) timeline.to(content, { opacity: 1, duration: 0.25 }, i - 1 + 0.65)
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
          // `z-0` (an explicit z-index, not the default `auto`) makes each
          // panel its own stacking context — without it, a panel's `z-10`
          // text content and a sibling panel's clip-path-induced backdrop
          // context both "leak" up to compete in the shared grandparent
          // context, where ALL panels' z-10 text ends up painting above ALL
          // panels' backdrops regardless of DOM order — so an earlier
          // panel's text can float above a later, fully-opaque panel.
          <div key={i} data-pin-panel className="absolute inset-0 z-0">
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}
