'use client'

import { useEffect, useRef, useState } from 'react'
import { refreshOnReady } from '@/components/motion/use-gsap-scope'
import { useReducedMotion } from '@/components/motion/use-reduced-motion'
import type { TeamMemberRef } from '@/lib/sanity/types'
import { TeamMemberCard } from './team-member-card'

const TRACK_CLASS = 'flex gap-5 py-2 pl-4 sm:pl-[max(2rem,calc((100vw-72rem)/2+2rem))]'
const CARD_CLASS = 'w-[88%] max-w-[380px] shrink-0 sm:w-[31vw] sm:max-w-[480px] sm:min-w-[340px]'

/**
 * The Founding Circle row used to be a plain `overflow-x-auto` strip with
 * `touch-action: pan-x` so it wouldn't fight the page's vertical scroll —
 * but that also meant a vertical swipe starting on the row (easy to hit: on
 * mobile this row can run up to ~80svh tall) got swallowed as a horizontal
 * pan instead, leaving the page feeling stuck right there.
 *
 * Pinning the section and driving the row's horizontal position from
 * vertical scroll (the same pin+scrub pattern as the homepage's card stack)
 * fixes both at once: there's no native horizontal scroll container to
 * intercept a vertical touch, and the pin always releases — scrolling 1:1
 * through exactly the row's own overflow and no further — so vertical
 * scroll is guaranteed to resume once the row has been seen.
 */
export function FoundingCircleRow({ members }: { members: TeamMemberRef[] }) {
  const outerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    if (reducedMotion || !outerRef.current || !trackRef.current) return

    let cancelled = false
    let ctx: { revert: () => void } | null = null
    let resizeTimer: ReturnType<typeof setTimeout> | null = null
    let detachLenis: (() => void) | null = null
    let detachRefresh: (() => void) | null = null

    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        if (cancelled) return
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
          if (!cancelled) ScrollTrigger.refresh()
        })
      }, 200)
    }

    ;(async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      gsap.registerPlugin(ScrollTrigger)
      ScrollTrigger.config({ ignoreMobileResize: true })
      if (cancelled || !outerRef.current || !trackRef.current) return

      // Same staleness hazard as the homepage card stack's pin (see
      // useShuffleTimeline): content above this section settling late (a
      // font swap, an image) can shift this section down after the pin's
      // start position was measured, trapping scroll until a refresh.
      detachRefresh = refreshOnReady(() => ScrollTrigger.refresh())

      const lenis = window.__lenis
      if (lenis) {
        const onLenisScroll = () => ScrollTrigger.update()
        lenis.on('scroll', onLenisScroll)
        detachLenis = () => lenis.off('scroll', onLenisScroll)
      }

      ctx = gsap.context(() => {
        const maxScroll = () => trackRef.current!.scrollWidth - outerRef.current!.clientWidth
        if (maxScroll() <= 0) {
          setEnabled(false)
          return
        }

        gsap.to(trackRef.current, {
          x: () => -maxScroll(),
          ease: 'none',
          scrollTrigger: {
            trigger: outerRef.current,
            start: 'top top',
            end: () => `+=${maxScroll()}`,
            pin: true,
            invalidateOnRefresh: true,
            scrub: lenis ? 0.25 : 0.6,
          },
        })
      }, outerRef)
    })()

    window.addEventListener('resize', onResize)

    return () => {
      cancelled = true
      window.removeEventListener('resize', onResize)
      if (resizeTimer) clearTimeout(resizeTimer)
      detachLenis?.()
      detachRefresh?.()
      ctx?.revert()
    }
  }, [reducedMotion])

  // Reduced motion, or the row already fits with nothing to scroll through:
  // a plain horizontal strip the user can drag, same as before (minus the
  // `pan-x` restriction that caused the original bug).
  if (reducedMotion || !enabled) {
    return (
      <div className={`scrollbar-hide mt-8 overflow-x-auto ${TRACK_CLASS}`}>
        {members.map((member) => (
          <div key={member._id} className={CARD_CLASS}>
            <TeamMemberCard member={member} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div ref={outerRef} className="mt-8 overflow-hidden">
      <div ref={trackRef} className={TRACK_CLASS}>
        {members.map((member) => (
          <div key={member._id} className={CARD_CLASS}>
            <TeamMemberCard member={member} />
          </div>
        ))}
      </div>
    </div>
  )
}
