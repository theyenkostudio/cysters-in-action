'use client'

import { motion } from 'motion/react'
import { useLayoutEffect, useRef } from 'react'
import { ButtonLink } from '@/components/ui/button'
import { refreshOnReady } from '@/components/motion/use-gsap-scope'
import { useReducedMotion } from '@/components/motion/use-reduced-motion'
import { resolveHref } from '@/lib/link'
import type { AboutIntroBlockData, AboutStatValue } from '@/lib/sanity/types'
import { cn } from '@/lib/utils'

// Rotating accent for each stat's underline — stats aren't individually
// tied to a pillar, so this just cycles the same teal/orchid/lagoon trio
// used for Learn/Connect/Act elsewhere, for a bit of visual variety.
const ACCENT_VARS = [
  'var(--color-fg-heading)',
  'var(--color-orchid-text)',
  'var(--color-lagoon-text)',
]

// Stats row is parked for now (the boxed-card look is being redesigned and the
// numbers may move elsewhere). StatCard and its entrance animation below are
// kept intact: flip this to true to bring the row back as it was.
const SHOW_STATS = false

function formatStatNumber(value: number, decimals: number) {
  return value.toFixed(decimals)
}

function spokenStatText(stat: AboutStatValue): string {
  const unitWord =
    stat.unitSuffix === 'M'
      ? ' million'
      : stat.unitSuffix === 'K'
        ? ' thousand'
        : stat.unitSuffix
          ? ` ${stat.unitSuffix}`
          : ''
  const plus = stat.plusSign ? ' plus' : ''
  return `${formatStatNumber(stat.value, stat.decimals ?? 0)}${unitWord}${plus}, ${stat.label}`
}

function AboutCtaButton({ cta }: { cta: NonNullable<AboutIntroBlockData['cta']> }) {
  if (!cta.link) return null

  return (
    <ButtonLink href={resolveHref(cta.link)} variant="outline" size="sm">
      {cta.link.label}
    </ButtonLink>
  )
}

function StatCard({ stat, index }: { stat: AboutStatValue; index: number }) {
  const accent = ACCENT_VARS[index % ACCENT_VARS.length]

  return (
    <li data-stat-card>
      <motion.div
        className="bg-surface border-default rounded-card flex h-full min-h-[88px] flex-row items-center justify-between border p-6 md:min-h-[136px] md:flex-col md:items-stretch md:justify-between md:p-[24px_28px]"
        whileHover={{ y: -3, backgroundColor: 'var(--color-bg-subtle)' }}
        transition={{ duration: 0.2 }}
      >
        <p className="font-body text-fg-default relative inline-flex items-start text-[clamp(36px,3vw,48px)] leading-none font-normal tracking-[-0.02em] tabular-nums">
          {/* Starts at its final value (not "0") so a reader never sees a
              stuck/blank number if JS fails to load — the count-up tween's
              own onUpdate immediately takes over and animates from 0 once it
              actually runs; see the note on SplitHeadline's old SSR/GSAP
              conflict bug for why nothing here is pre-hidden via CSS. */}
          <span
            data-stat-number
            aria-hidden="true"
            // Reserves the FINAL digit count's width up front (tabular-nums
            // makes each digit a fixed width, so N characters ⇒ a known
            // width) so the box never grows as the count climbs from "0" to
            // its final value — a counting number is the one place in this
            // component where the growing *character count* itself (not
            // just an animated transform) would otherwise reflow the unit
            // suffix/sup/underline next to it. Spec: "No layout shift
            // during the count (CLS ≈ 0 for this section)."
            className="inline-block"
            style={{ minWidth: `${formatStatNumber(stat.value, stat.decimals ?? 0).length}ch` }}
          >
            {formatStatNumber(stat.value, stat.decimals ?? 0)}
          </span>
          {stat.unitSuffix && <span aria-hidden="true">{stat.unitSuffix}</span>}
          {stat.plusSign && (
            <sup data-stat-sup aria-hidden="true" className="text-[45%] leading-none font-normal">
              +
            </sup>
          )}
          <span
            data-stat-underline
            aria-hidden="true"
            className="absolute -bottom-1.5 left-0 h-px w-8 origin-left"
            style={{ backgroundColor: accent }}
          />
          <span className="sr-only">{spokenStatText(stat)}</span>
        </p>
        <p className="text-fg-muted text-[13px] font-normal">{stat.label}</p>
      </motion.div>
    </li>
  )
}

export function AboutIntroBlock({ data }: { data: AboutIntroBlockData }) {
  const sectionRef = useRef<HTMLElement>(null)
  const dotRef = useRef<HTMLSpanElement>(null)
  const eyebrowLabelRef = useRef<HTMLSpanElement>(null)
  const headingInnerRef = useRef<HTMLSpanElement>(null)
  const paragraphInnerRef = useRef<HTMLSpanElement>(null)
  const buttonWrapRef = useRef<HTMLDivElement>(null)
  const statsRowRef = useRef<HTMLUListElement>(null)
  const reducedMotion = useReducedMotion()
  const animation = data.animation ?? 'exaggerated'
  const playsAnimation = animation !== 'none' && !reducedMotion

  // useLayoutEffect so the SplitText revert in cleanup runs before React removes
  // DOM nodes on unmount — passive cleanups run after, and removeChild then
  // throws because SplitText has re-parented React's text nodes.
  useLayoutEffect(() => {
    if (!playsAnimation || !sectionRef.current) return

    let cancelled = false
    let ctx: { revert: () => void } | null = null
    let resizeTimer: ReturnType<typeof setTimeout> | null = null
    let detachRefresh: (() => void) | null = null
    // gsap.context() only tracks tweens/ScrollTriggers for cleanup, not
    // SplitText instances — reverted explicitly below so React Strict
    // Mode's mount→cleanup→mount doesn't split already-split markup again.
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
      ScrollTrigger.config({ ignoreMobileResize: true })
      if (cancelled || !sectionRef.current) return

      // Content above this section (hero) settling late — a font swap, an
      // image finishing layout — can shift it after this section's own
      // ScrollTriggers measured their start positions.
      detachRefresh = refreshOnReady(() => ScrollTrigger.refresh())

      ctx = gsap.context(() => {
        // --- 1. Eyebrow: dot overshoot, label slides in, then a slow pulse ---
        if (dotRef.current && eyebrowLabelRef.current) {
          gsap.set(dotRef.current, { scale: 0, transformOrigin: 'center' })
          gsap.set(eyebrowLabelRef.current, { x: -8, opacity: 0 })
        }

        const headingSplit = headingInnerRef.current
          ? new SplitText(headingInnerRef.current, {
              type: 'lines',
              mask: 'lines',
              linesClass: 'line',
            })
          : null
        if (headingSplit) {
          splitInstances.push(headingSplit)
          gsap.set(headingSplit.lines, { yPercent: 100 })
        }

        const entrance = gsap.timeline({
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        })
        if (dotRef.current) {
          entrance.to(dotRef.current, { scale: 1, duration: 0.6, ease: 'back.out(3)' })
        }
        if (eyebrowLabelRef.current) {
          entrance.to(
            eyebrowLabelRef.current,
            { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
            '-=0.3',
          )
        }
        if (headingSplit) {
          entrance.to(
            headingSplit.lines,
            { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 },
            '-=0.1',
          )
        }
        if (buttonWrapRef.current) {
          entrance.fromTo(
            buttonWrapRef.current,
            { y: 12, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
          )
        }
        entrance.call(() => {
          if (dotRef.current) {
            gsap.to(dotRef.current, {
              scale: 1.3,
              duration: 1.5,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
            })
          }
        })

        // --- 2. Paragraph: scrubbed word reveal (or a plain fade for "subtle") ---
        const paragraphSplit = paragraphInnerRef.current
          ? new SplitText(paragraphInnerRef.current, { type: 'words', wordsClass: 'word' })
          : null
        if (paragraphSplit) {
          splitInstances.push(paragraphSplit)
          gsap.set(paragraphSplit.words, { color: 'var(--color-fg-subtle)', opacity: 0.25 })
          if (animation === 'subtle') {
            gsap.to(paragraphSplit.words, {
              color: 'var(--color-fg-default)',
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
              stagger: 0.015,
              scrollTrigger: { trigger: paragraphInnerRef.current, start: 'top 80%', once: true },
            })
          } else {
            gsap.to(paragraphSplit.words, {
              color: 'var(--color-fg-default)',
              opacity: 1,
              duration: 1,
              stagger: 0.05,
              scrollTrigger: {
                trigger: paragraphInnerRef.current,
                start: 'top 70%',
                end: 'bottom 60%',
                scrub: true,
              },
            })
          }
        }

        // --- 3. Stat cards: stagger reveal, count up, sup pop, underline draw ---
        if (statsRowRef.current) {
          const cards = Array.from(
            statsRowRef.current.querySelectorAll<HTMLElement>('[data-stat-card]'),
          )
          gsap.set(cards, { y: 24, opacity: 0 })

          const statsTl = gsap.timeline({
            scrollTrigger: { trigger: statsRowRef.current, start: 'top 85%', once: true },
          })

          cards.forEach((card, i) => {
            statsTl.to(card, { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out' }, i * 0.1)

            const stat = data.stats[i]
            const numberEl = card.querySelector<HTMLElement>('[data-stat-number]')
            const supEl = card.querySelector<HTMLElement>('[data-stat-sup]')
            const underlineEl = card.querySelector<HTMLElement>('[data-stat-underline]')
            if (supEl) gsap.set(supEl, { scale: 0.4, y: 4, opacity: 0 })
            if (underlineEl) gsap.set(underlineEl, { scaleX: 0 })
            if (!stat || !numberEl) return

            const decimals = stat.decimals ?? 0
            const counter = { val: 0 }
            statsTl.to(
              counter,
              {
                val: stat.value,
                duration: 1.6,
                ease: 'power3.out',
                onUpdate: () => {
                  numberEl.textContent = formatStatNumber(counter.val, decimals)
                },
                onComplete: () => {
                  if (supEl) {
                    gsap.to(supEl, {
                      scale: 1,
                      y: 0,
                      opacity: 1,
                      duration: 0.4,
                      ease: 'back.out(2)',
                    })
                  }
                  if (underlineEl) {
                    gsap.to(underlineEl, { scaleX: 1, duration: 0.5, ease: 'power2.out' })
                  }
                },
              },
              i * 0.1,
            )
          })
        }
      }, sectionRef)
    })()

    window.addEventListener('resize', onResize)

    return () => {
      cancelled = true
      window.removeEventListener('resize', onResize)
      if (resizeTimer) clearTimeout(resizeTimer)
      detachRefresh?.()
      // Order matters: kill tweens/ScrollTriggers touching the split nodes
      // before SplitText restores the original, unsplit text.
      ctx?.revert()
      splitInstances.forEach((s) => s.revert())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- data.stats/animation are stable per render of this block instance
  }, [playsAnimation])

  const statsGridCols = data.stats.length >= 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'

  return (
    <motion.section
      ref={sectionRef}
      className="bg-canvas px-[clamp(32px,5vw,80px)] py-[clamp(96px,10vw,160px)]"
      initial={reducedMotion ? { opacity: 0 } : undefined}
      animate={reducedMotion ? { opacity: 1 } : undefined}
      transition={{ duration: 0.2 }}
    >
      <div className="mx-auto max-w-[1240px]">
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:items-start lg:gap-x-[clamp(32px,4vw,64px)]">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2">
              <span
                ref={dotRef}
                aria-hidden="true"
                className="bg-accent-orchid inline-block h-2 w-2 rounded-full"
              />
              <span
                ref={eyebrowLabelRef}
                className="text-fg-default text-[11px] font-medium tracking-[0.12em] uppercase sm:text-[12px]"
              >
                {data.eyebrow ?? 'About us'}
              </span>
            </div>

            <h2
              aria-label={data.heading}
              className="font-display text-fg-heading mt-5 max-w-[11ch] text-[clamp(40px,3.6vw,56px)] leading-[1.05] font-medium tracking-[-0.02em]"
            >
              <span ref={headingInnerRef} aria-hidden="true" className="block">
                {data.heading}
              </span>
            </h2>
          </div>

          <div className="lg:col-span-7">
            <p className="text-fg-default max-w-[640px] text-[clamp(22px,1.9vw,30px)] leading-[1.3] font-normal tracking-[-0.01em]">
              {/* aria-label isn't a permitted attribute on a bare <p> (no
                  role) — a visually-hidden sibling with the plain text
                  reads the same to assistive tech without that violation. */}
              <span className="sr-only">{data.body}</span>
              <span ref={paragraphInnerRef} aria-hidden="true" className="block">
                {data.body}
              </span>
            </p>

            {data.cta && (
              <div ref={buttonWrapRef} className="mt-8">
                <AboutCtaButton cta={data.cta} />
              </div>
            )}

            {SHOW_STATS && (
              <ul ref={statsRowRef} className={cn('mt-14 grid grid-cols-1 gap-4', statsGridCols)}>
                {data.stats.map((stat, i) => (
                  <StatCard key={i} stat={stat} index={i} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
