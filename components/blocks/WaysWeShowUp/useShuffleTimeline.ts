import { useEffect, useLayoutEffect, useRef } from 'react'
import { refreshOnReady, settleOnSteps } from '@/components/motion/use-gsap-scope'
import type { RefObject } from 'react'
import { PILLAR_SOLID_VAR } from './pillar-colors'
import type { PillarKey } from '@/lib/sanity/types'

// Resting poses by "depth" (0 = front, 1 = middle, 2 = back). Matches the
// spec's reference numbers: back -6deg / -24px,-40px; middle +4deg; front -2deg.
const DEPTH_POSE = [
  { x: 0, y: 0, rotate: -2, scale: 1, dim: 0 },
  { x: -12, y: -20, rotate: 4, scale: 0.97, dim: 0.08 },
  { x: -24, y: -40, rotate: -6, scale: 0.94, dim: 0.15 },
] as const

const HIDDEN_POSE = { x: -24, y: -40, rotate: -6, scale: 0.88, opacity: 0 }

export type ShuffleCard = { pillar: PillarKey }

/**
 * Builds and owns the single scrubbed, reversible GSAP master timeline for
 * the card stack: pin, shuffle (front card retires to the back, the rest
 * advance a slot), description crossfade, progress indicator, sticker
 * colour/wobble. Everything is one timeline with a label per step, driven
 * entirely by its ScrollTrigger — no separate onEnter/onLeave tweens, so
 * scrubbing is exactly reversible.
 *
 * All refs are plain DOM refs to elements that already exist in the
 * resting (pre-shuffle) DOM order — cards/descriptions/bars never get
 * reparented; only their transforms/opacity are animated.
 */
export function useShuffleTimeline({
  enabled,
  sectionRef,
  stackRef,
  cardRefs,
  descRefs,
  highlightClass,
  progressLabelRefs,
  progressBarFillRefs,
  stickerRef,
  cards,
  isMobile,
}: {
  enabled: boolean
  sectionRef: RefObject<HTMLElement | null>
  stackRef: RefObject<HTMLDivElement | null>
  cardRefs: RefObject<(HTMLDivElement | null)[]>
  descRefs: RefObject<(HTMLDivElement | null)[]>
  /** Class name the `highlight` mark renderer puts on its <mark>. */
  highlightClass: string
  progressLabelRefs: RefObject<(HTMLSpanElement | null)[]>
  progressBarFillRefs: RefObject<(HTMLDivElement | null)[]>
  stickerRef: RefObject<HTMLDivElement | null>
  cards: ShuffleCard[]
  isMobile: boolean
}) {
  // Teardown (reverting the tweens) is registered by the effect below but run
  // from a layout-effect cleanup, so it happens before React removes DOM nodes
  // on unmount. Setup must stay a passive useEffect: sectionRef belongs to an ancestor, whose ref is only
  // attached after this component's layout effects run.
  const teardownRef = useRef<(() => void) | null>(null)
  useLayoutEffect(
    () => () => {
      teardownRef.current?.()
      teardownRef.current = null
    },
    [enabled, isMobile],
  )

  useEffect(() => {
    if (!enabled || !sectionRef.current || !stackRef.current) return
    const n = cards.length
    if (n < 2) return

    let cancelled = false
    let ctx: { revert: () => void } | null = null
    let resizeTimer: ReturnType<typeof setTimeout> | null = null
    let detachLenis: (() => void) | null = null
    let detachSnap: (() => void) | null = null
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
      if (cancelled || !sectionRef.current || !stackRef.current) return

      // The pin's `start: 'top top'` is recorded in document coordinates at
      // setup time, below content (hero, about-intro) whose height can still
      // shift afterwards — a web font swapping in, or an image above this
      // section finishing layout. Window `resize` doesn't fire for that, so
      // without this the pin's start/end can go stale and trap native
      // wheel/touch scroll just past it (a scrollbar drag forces a resync,
      // which is why that "unsticks" it). `invalidateOnRefresh` on the
      // ScrollTrigger below means a refresh recomputes from current layout.
      detachRefresh = refreshOnReady(() => ScrollTrigger.refresh())

      // Bridges Lenis's smoothed scroll events into ScrollTrigger so pin/
      // scrub/snap stay in sync with it, without this hook owning Lenis's
      // own rAF loop (LenisProvider keeps driving that independently).
      const lenis = window.__lenis
      if (lenis) {
        const onLenisScroll = () => ScrollTrigger.update()
        lenis.on('scroll', onLenisScroll)
        detachLenis = () => lenis.off('scroll', onLenisScroll)
      }

      const cardEls = cardRefs.current ?? []
      const descEls = descRefs.current ?? []
      // The card's single stamped word (LEARN/CONNECT/ACT) — one element
      // per card (there's nothing to stagger within it).
      const wordGroups = cardEls.map((el) => {
        const word = el?.querySelector<HTMLElement>('[data-distressed-word]')
        return word ? [word] : []
      })
      // The descriptions are already split into `.wwsu-word` spans by React
      // (see CardDescription), so there's nothing to split here.
      const barFills = progressBarFillRefs.current ?? []
      const labels = progressLabelRefs.current ?? []
      const sticker = stickerRef.current

      ctx = gsap.context(() => {
        const depthOf = (cardIndex: number, step: number) => (cardIndex - step + n * n) % n

        // --- resting state at step 0 ---
        cardEls.forEach((el, i) => {
          if (!el) return
          const d = depthOf(i, 0)
          const pose = d <= 2 ? DEPTH_POSE[d] : HIDDEN_POSE
          gsap.set(el, {
            x: pose.x,
            y: pose.y,
            rotate: pose.rotate,
            scale: pose.scale,
            zIndex: 10 - d,
          })
          if ('dim' in pose) gsap.set(el.querySelector('[data-card-dim]'), { opacity: pose.dim })
          if ('opacity' in pose) gsap.set(el, { opacity: pose.opacity })
        })
        descEls.forEach((el, i) => {
          if (!el) return
          gsap.set(el, {
            opacity: i === 0 ? 1 : 0,
            y: i === 0 ? 0 : 20,
            // the layers stack in one spot: only the visible one takes clicks
            pointerEvents: i === 0 ? 'auto' : 'none',
          })
        })
        wordGroups.forEach((words, i) => {
          gsap.set(words, { opacity: i === 0 ? 1 : 0, scale: i === 0 ? 1 : 1.12 })
        })
        barFills.forEach((el, i) => el && gsap.set(el, { scaleX: i === 0 ? 1 : 0 }))
        labels.forEach((el, i) => el && gsap.set(el, { opacity: i === 0 ? 1 : 0 }))
        if (sticker) {
          gsap.set(sticker, { rotate: 12, backgroundColor: PILLAR_SOLID_VAR[cards[0].pillar] })
        }

        const totalSteps = n - 1
        const stepVh = isMobile ? 55 : 70
        const maxRotate = isMobile ? 4 : 8

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            // GSAP's `+=N` shorthand is pixels only (no `vh`), so this is a
            // function: real pixels from the live viewport height, re-evaluated
            // on ScrollTrigger.refresh().
            end: () => `+=${(totalSteps * stepVh * window.innerHeight) / 100}`,
            pin: true,
            invalidateOnRefresh: true,
            // Lenis already eases the wheel, so only a little scrub lag on top
            // (a long one double-smooths and makes everything trail). The
            // built-in snap calls native scrollTo, which fights Lenis; with
            // Lenis we settle on each card ourselves (below) instead.
            scrub: lenis ? 0.25 : 0.6,
            ...(lenis
              ? {}
              : { snap: { snapTo: 1 / totalSteps, duration: 0.5, ease: 'power2.inOut' } }),
          },
        })
        if (lenis) detachSnap = settleOnSteps(timeline.scrollTrigger!, totalSteps)

        // One step = 1 unit of timeline time. Cards and copy share this clock:
        //   0.00-0.50  front card lifts out, its copy rises away with it
        //   0.40-0.95  copy for the next card rises in as that card settles
        //   0.50-1.00  lifted card drops behind; the rest slide forward
        for (let step = 0; step < totalSteps; step++) {
          const outgoingIndex = step % n
          const outgoingEl = cardEls[outgoingIndex]
          const at = step

          if (outgoingEl) {
            timeline
              .to(
                outgoingEl,
                {
                  y: '-=55%',
                  rotate: maxRotate,
                  scale: 1.04,
                  duration: 0.5,
                  ease: 'power2.out',
                },
                at,
              )
              .set(outgoingEl, { zIndex: 1 }, at + 0.5)
              .to(
                outgoingEl,
                {
                  x: DEPTH_POSE[2].x,
                  y: DEPTH_POSE[2].y,
                  rotate: DEPTH_POSE[2].rotate,
                  scale: DEPTH_POSE[2].scale,
                  duration: 0.5,
                  ease: 'power2.inOut',
                },
                at + 0.5,
              )
              .to(
                outgoingEl.querySelector('[data-card-dim]'),
                { opacity: DEPTH_POSE[2].dim, duration: 0.5 },
                at + 0.5,
              )
          }

          for (let d = 0; d <= 2; d++) {
            const cardIndex = (outgoingIndex + 1 + d) % n
            if (cardIndex === outgoingIndex) continue
            const el = cardEls[cardIndex]
            if (!el) continue
            const pose = DEPTH_POSE[d]
            timeline
              .to(
                el,
                {
                  x: pose.x,
                  y: pose.y,
                  rotate: pose.rotate,
                  scale: pose.scale,
                  zIndex: 10 - d,
                  duration: 1,
                  ease: 'power2.inOut',
                },
                at,
              )
              .to(el.querySelector('[data-card-dim]'), { opacity: pose.dim, duration: 1 }, at)

            // the card taking the front stamps its word in as it settles
            if (d === 0) {
              const words = wordGroups[cardIndex]
              if (words?.length) {
                timeline.fromTo(
                  words,
                  { opacity: 0, scale: 1.12 },
                  { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' },
                  at + 0.55,
                )
              }
            }
          }

          for (let d = 3; d < n; d++) {
            const cardIndex = (outgoingIndex + 1 + d) % n
            const el = cardEls[cardIndex]
            if (!el) continue
            timeline.set(el, HIDDEN_POSE, at + 1)
          }

          // Copy: leaves with the lifting card, arrives with the settling one.
          const incomingIndex = (outgoingIndex + 1) % n
          const outDesc = descEls[outgoingIndex]
          const inDesc = descEls[incomingIndex]
          if (outDesc) {
            timeline
              .to(outDesc, { opacity: 0, y: -16, duration: 0.4, ease: 'power1.in' }, at + 0.04)
              .set(outDesc, { pointerEvents: 'none' }, at + 0.1)
          }
          if (inDesc) {
            timeline
              .fromTo(
                inDesc,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
                at + 0.42,
              )
              .set(inDesc, { pointerEvents: 'auto' }, at + 0.55)
            const words = inDesc.querySelectorAll<HTMLElement>('.wwsu-word')
            if (words.length) {
              // spread capped so the whole reveal always fits inside the step
              const each = words.length > 1 ? Math.min(0.012, 0.22 / (words.length - 1)) : 0
              timeline.fromTo(
                words,
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, duration: 0.3, stagger: each, ease: 'power2.out' },
                at + 0.46,
              )
            }
            const highlights = inDesc.querySelectorAll<HTMLElement>(`.${highlightClass}`)
            if (highlights.length) {
              timeline.fromTo(
                highlights,
                { color: 'var(--color-fg-default)' },
                { color: PILLAR_SOLID_VAR[cards[incomingIndex].pillar], duration: 0.25 },
                at + 0.7,
              )
            }
          }

          if (labels[outgoingIndex])
            timeline.to(labels[outgoingIndex]!, { opacity: 0, duration: 0.25 }, at + 0.25)
          if (labels[incomingIndex])
            timeline.to(labels[incomingIndex]!, { opacity: 1, duration: 0.25 }, at + 0.5)
          if (barFills[outgoingIndex]) {
            timeline.to(
              barFills[outgoingIndex]!,
              { scaleX: 0, duration: 0.45, ease: 'power1.inOut' },
              at + 0.2,
            )
          }
          if (barFills[incomingIndex]) {
            timeline.to(
              barFills[incomingIndex]!,
              { scaleX: 1, duration: 0.45, ease: 'power1.inOut' },
              at + 0.4,
            )
          }
          if (sticker) {
            // one smooth turn per step (a repeating wobble jitters under scrub)
            timeline
              .to(
                sticker,
                { backgroundColor: PILLAR_SOLID_VAR[cards[incomingIndex].pillar], duration: 0.5 },
                at + 0.35,
              )
              .to(
                sticker,
                { rotate: step % 2 === 0 ? -6 : 12, duration: 0.7, ease: 'power2.inOut' },
                at + 0.2,
              )
          }
        }
      }, sectionRef)
    })()

    window.addEventListener('resize', onResize)

    teardownRef.current = () => {
      cancelled = true
      window.removeEventListener('resize', onResize)
      if (resizeTimer) clearTimeout(resizeTimer)
      detachLenis?.()
      detachSnap?.()
      detachRefresh?.()
      ctx?.revert()
    }
    return () => {
      teardownRef.current?.()
      teardownRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- cards/refs are stable per mounted instance
  }, [enabled, isMobile])
}
