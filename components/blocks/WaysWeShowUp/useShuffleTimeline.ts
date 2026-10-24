import { useEffect } from 'react'
import type { RefObject } from 'react'
import { PILLAR_SOLID_VAR } from './pillar-colors'
import type { PillarKey } from '@/lib/sanity/types'

// Resting poses by "depth" (0 = front, 1 = middle, 2 = back). Matches the
// spec's reference numbers: back -6deg / -24px,-40px; middle +4deg; front -2deg.
const DEPTH_POSE = [
  { x: 0, y: 0, rotate: -2, scale: 1, filter: 'brightness(1)' },
  { x: -12, y: -20, rotate: 4, scale: 0.97, filter: 'brightness(0.92)' },
  { x: -24, y: -40, rotate: -6, scale: 0.94, filter: 'brightness(0.85)' },
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
  useEffect(() => {
    if (!enabled || !sectionRef.current || !stackRef.current) return
    const n = cards.length
    if (n < 2) return

    let cancelled = false
    let ctx: { revert: () => void } | null = null
    let resizeTimer: ReturnType<typeof setTimeout> | null = null
    let detachLenis: (() => void) | null = null
    // gsap.context() doesn't track SplitText instances for cleanup — see
    // the same note in useShuffleTimeline's sibling, about-intro-block.tsx.
    const splitInstances: { revert: () => void }[] = []

    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => ScrollTrigger.refresh())
      }, 200)
    }

    ;(async () => {
      const [{ default: gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('gsap/SplitText'),
      ])
      gsap.registerPlugin(ScrollTrigger, SplitText)
      if (cancelled || !sectionRef.current || !stackRef.current) return

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
      // per card, not SplitText (there's nothing to stagger within it).
      const wordGroups = cardEls.map((el) => {
        const word = el?.querySelector<HTMLElement>('[data-distressed-word]')
        return word ? [word] : []
      })
      // The description IS split into words (for the per-word stagger
      // reveal) — done once, up front, for every card's description, not
      // re-split on every shuffle.
      descEls.forEach((el) => {
        if (!el) return
        const split = new SplitText(el, { type: 'words', wordsClass: 'wwsu-word' })
        splitInstances.push(split)
      })
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
          if ('filter' in pose) gsap.set(el, { filter: pose.filter })
          if ('opacity' in pose) gsap.set(el, { opacity: pose.opacity })
        })
        descEls.forEach((el, i) => {
          if (!el) return
          gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 16 })
        })
        wordGroups.forEach((words, i) => {
          gsap.set(words, { opacity: i === 0 ? 1 : 0, scale: i === 0 ? 1 : 1.15 })
        })
        barFills.forEach((el, i) => el && gsap.set(el, { scaleX: i === 0 ? 1 : 0 }))
        labels.forEach((el, i) => el && gsap.set(el, { opacity: i === 0 ? 1 : 0 }))
        if (sticker) {
          gsap.set(sticker, { rotate: 12, backgroundColor: PILLAR_SOLID_VAR[cards[0].pillar] })
        }

        const totalSteps = n - 1
        const stepVh = isMobile ? 60 : 80
        const maxRotate = isMobile ? 4 : 10

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            // GSAP's `+=N` relative shorthand is pixels only — it has no
            // `vh` parsing, so `'+=160vh'` silently became `+=160` (160
            // actual pixels, not 160vh), making the whole shuffle happen
            // within a ~160px pin instead of ~1440px. A function recomputes
            // this in real pixels from the current viewport height, and
            // (being a function) also re-evaluates on ScrollTrigger.refresh().
            end: () => `+=${(totalSteps * stepVh * window.innerHeight) / 100}`,
            pin: true,
            scrub: 0.6,
            snap: { snapTo: 1 / totalSteps, duration: 0.4, ease: 'power2.inOut' },
          },
        })

        for (let step = 0; step < totalSteps; step++) {
          const outgoingIndex = step % n
          const outgoingEl = cardEls[outgoingIndex]
          const at = step // this step occupies timeline time [step, step+1)

          // (a)+(c) front card lifts out, flips behind, settles into the back slot
          if (outgoingEl) {
            timeline
              .to(
                outgoingEl,
                {
                  y: '-=60%',
                  rotate: Math.min(10, maxRotate),
                  scale: 1.04,
                  duration: 0.5,
                  ease: 'power1.inOut',
                },
                at,
              )
              .set(outgoingEl, { zIndex: 1 }, at + 0.5) // (b) drops behind mid-step
              .to(
                outgoingEl,
                {
                  x: DEPTH_POSE[2].x,
                  y: DEPTH_POSE[2].y,
                  rotate: DEPTH_POSE[2].rotate,
                  scale: DEPTH_POSE[2].scale,
                  filter: DEPTH_POSE[2].filter,
                  duration: 0.5,
                  ease: 'power2.out',
                },
                at + 0.5,
              )
          }

          // (d) every other visible card advances one slot
          for (let d = 0; d <= 2; d++) {
            const cardIndex = (outgoingIndex + 1 + d) % n
            if (cardIndex === outgoingIndex) continue
            const el = cardEls[cardIndex]
            if (!el) continue
            const nextDepth = d // after this step, it occupies depth d
            const pose = DEPTH_POSE[nextDepth]
            timeline.to(
              el,
              {
                x: pose.x,
                y: pose.y,
                rotate: pose.rotate,
                scale: pose.scale,
                filter: pose.filter,
                zIndex: 10 - nextDepth,
                duration: 1,
                ease: 'power2.inOut',
              },
              at,
            )

            // The card landing at depth 0 (new front) punches its word in,
            // straightens, during the last ~30% of the step.
            if (nextDepth === 0) {
              const words = wordGroups[cardIndex]
              if (words?.length) {
                timeline.fromTo(
                  words,
                  { opacity: 0, scale: 1.15 },
                  { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.6)' },
                  at + 0.7,
                )
              }
            }
          }

          // Cards beyond depth 2 (only relevant for >3 cards) just shift
          // their queue position, staying hidden.
          for (let d = 3; d < n; d++) {
            const cardIndex = (outgoingIndex + 1 + d) % n
            const el = cardEls[cardIndex]
            if (!el) continue
            timeline.set(el, HIDDEN_POSE, at + 1)
          }

          // (e) description cross-fade: outgoing fades/rises out early,
          // incoming's pre-split words rise in with a stagger, its
          // highlighted word(s) colour in last.
          const incomingIndex = (outgoingIndex + 1) % n
          const outDesc = descEls[outgoingIndex]
          const inDesc = descEls[incomingIndex]
          if (outDesc) {
            timeline.to(outDesc, { opacity: 0, y: -16, duration: 0.3, ease: 'power1.in' }, at)
          }
          if (inDesc) {
            timeline
              .set(inDesc, { y: 16 }, at + 0.3)
              .to(inDesc, { opacity: 1, y: 0, duration: 0.1 }, at + 0.3)
            const words = inDesc.querySelectorAll<HTMLElement>('.wwsu-word')
            if (words.length) {
              // A flat 0.02 stagger looks right for a handful of words but
              // badly overflows this step's [step, step+1] time budget for
              // a ~40-word description (0.02 * 39 ≈ 0.8 extra units) — which
              // silently inflates timeline.duration() past `totalSteps`,
              // desyncing the scroll-distance-to-step mapping below (every
              // step after the first one lands at the wrong scroll
              // position). Capped so the whole group's spread (base
              // duration + stagger) always fits well inside the step.
              const spreadBudget = 0.2
              const staggerEach =
                words.length > 1 ? Math.min(0.02, spreadBudget / (words.length - 1)) : 0
              timeline.fromTo(
                words,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.3, stagger: staggerEach, ease: 'power2.out' },
                at + 0.3,
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

          // (f) progress counter + bars + sticker
          if (labels[outgoingIndex])
            timeline.to(labels[outgoingIndex]!, { opacity: 0, duration: 0.2 }, at + 0.3)
          if (labels[incomingIndex])
            timeline.to(labels[incomingIndex]!, { opacity: 1, duration: 0.2 }, at + 0.5)
          if (barFills[outgoingIndex]) {
            timeline.to(
              barFills[outgoingIndex]!,
              { scaleX: 0, duration: 0.4, ease: 'power1.inOut' },
              at + 0.2,
            )
          }
          if (barFills[incomingIndex]) {
            timeline.to(
              barFills[incomingIndex]!,
              { scaleX: 1, duration: 0.4, ease: 'power1.inOut' },
              at + 0.4,
            )
          }
          if (sticker) {
            timeline
              .to(
                sticker,
                { backgroundColor: PILLAR_SOLID_VAR[cards[incomingIndex].pillar], duration: 0.4 },
                at + 0.4,
              )
              .fromTo(
                sticker,
                { rotate: 12 },
                { rotate: -6, duration: 0.15, ease: 'power1.inOut', yoyo: true, repeat: 3 },
                at + 0.4,
              )
          }
        }
      }, sectionRef)
    })()

    window.addEventListener('resize', onResize)

    return () => {
      cancelled = true
      window.removeEventListener('resize', onResize)
      if (resizeTimer) clearTimeout(resizeTimer)
      detachLenis?.()
      // Order matters: kill tweens/ScrollTrigger touching the split nodes
      // before SplitText restores the original, unsplit description text.
      ctx?.revert()
      splitInstances.forEach((s) => s.revert())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- cards/refs are stable per mounted instance
  }, [enabled, isMobile])
}
