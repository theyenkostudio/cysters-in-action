'use client'

import Image from 'next/image'
import NextLink from 'next/link'
import { useRef } from 'react'
import { NewsletterForm } from '@/components/forms/newsletter-form'
import { useReducedMotion } from '@/components/motion/use-reduced-motion'
import { useGsapScope } from '@/components/motion/use-gsap-scope'

type Cell =
  | { kind: 'photo'; src: string }
  | { kind: 'label'; text: string; href: string; tone: 'blush' | 'lagoon' | 'lilac' }
  | { kind: 'center' }
  | { kind: 'empty' }

// Pointy-top honeycomb: rows alternate 5 and 4 cells, odd rows are offset by
// half a cell. Photos are placeholders until real photography is supplied.
const ROWS: Cell[][] = [
  [
    { kind: 'photo', src: '/placeholder/hero.jpg' },
    { kind: 'label', text: 'Share a story', href: '/connect/share-your-story', tone: 'blush' },
    { kind: 'photo', src: '/placeholder/about-hero.jpg' },
    { kind: 'photo', src: '/placeholder/learn-hub-hero.jpg' },
    { kind: 'empty' },
  ],
  [
    { kind: 'photo', src: '/placeholder/pillar-connect.jpg' },
    { kind: 'photo', src: '/placeholder/wwsu-connect.jpg' },
    { kind: 'center' },
    { kind: 'photo', src: '/placeholder/cta-closing.jpg' },
  ],
  [
    { kind: 'photo', src: '/placeholder/wwsu-learn.jpg' },
    { kind: 'label', text: 'Ask a question', href: '/contact', tone: 'lagoon' },
    { kind: 'photo', src: '/placeholder/pillar-learn.jpg' },
    { kind: 'label', text: 'Find your people', href: '/connect/events', tone: 'lilac' },
    { kind: 'photo', src: '/placeholder/pillar-act.jpg' },
  ],
  [
    { kind: 'empty' },
    { kind: 'photo', src: '/placeholder/problem-solution.jpg' },
    { kind: 'photo', src: '/placeholder/category-livingwell.jpg' },
    { kind: 'label', text: 'Take action', href: '/about', tone: 'blush' },
  ],
]

const TONE: Record<string, string> = {
  blush: 'color-mix(in srgb, var(--orchid-500) 16%, var(--color-canvas))',
  lagoon: 'color-mix(in srgb, var(--lagoon-500) 24%, var(--color-canvas))',
  lilac: 'color-mix(in srgb, var(--orchid-500) 30%, var(--color-canvas))',
}
const TONE_HOVER: Record<string, string> = {
  blush: 'color-mix(in srgb, var(--orchid-500) 28%, var(--color-canvas))',
  lagoon: 'color-mix(in srgb, var(--lagoon-500) 38%, var(--color-canvas))',
  lilac: 'color-mix(in srgb, var(--orchid-500) 44%, var(--color-canvas))',
}

const HEX = 'polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)'
const CELL_W = 19.4 // % of the hive width
const PITCH_X = 20.15
const PITCH_Y = 23.55
const CENTER_INDEX = ROWS.slice(0, 1).flat().length + 2

function focusEmail() {
  const el = document.getElementById('newsletter-email-newsletterBlock')
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  el?.focus({ preventScroll: true })
}

/**
 * Newsletter as a honeycomb "hive": every cell is a member, a story or a
 * question. Cells pop in from the middle outward, then breathe; photos wake
 * from grey on hover. The plum "You?" cell (and the empty "+" cells) jump to
 * the email field. The labelled cells link to the other ways in.
 */
export function HiveNewsletter({
  eyebrow = 'Join us',
  heading = 'Join the community.',
  body,
  buttonLabel = 'Join',
  successMessage,
  animated = true,
}: {
  eyebrow?: string
  heading?: string
  body?: string
  buttonLabel?: string
  successMessage?: string
  animated?: boolean
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)

  useGsapScope(
    ref,
    ({ gsap, ScrollTrigger }) => {
      const q = gsap.utils.selector(ref.current!)
      const cells = q('[data-cell]')
      const fades = q('[data-fade]')
      gsap.set(cells, { scale: 0, rotate: -28, opacity: 0, transformOrigin: '50% 50%' })
      gsap.set(fades, { opacity: 0, y: 18 })
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 68%',
        once: true,
        onEnter: () => {
          gsap.to(fades, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out' })
          gsap.to(cells, {
            scale: 1,
            rotate: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'back.out(1.6)',
            stagger: { each: 0.05, from: CENTER_INDEX },
          })
        },
      })
    },
    animated && !reduced,
    [],
  )

  return (
    <section ref={ref} className="bg-canvas px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-x-[clamp(56px,7vw,112px)]">
        <div className="min-w-0 lg:col-span-5">
          <p data-fade className="text-orchid-text text-xs font-medium tracking-[0.2em] uppercase">
            {eyebrow}
          </p>
          <h2
            data-fade
            className="font-display text-fg-heading mt-4 text-[clamp(40px,5.2vw,72px)] leading-[1] font-semibold tracking-[-0.03em]"
          >
            {heading}
          </h2>
          {body && (
            <p data-fade className="text-fg-muted mt-6 max-w-[34rem] text-lg leading-relaxed">
              {body}
            </p>
          )}
          <div data-fade className="mt-8 max-w-[34rem]">
            <NewsletterForm
              source="newsletterBlock"
              variant="pill"
              buttonLabel={buttonLabel}
              successMessage={successMessage}
            />
            <p className="text-fg-muted mt-4 text-sm">
              Get the newsletter and hear first as we build this together. Unsubscribe any time.
            </p>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <div className="overflow-hidden sm:overflow-visible">
            <div
              className="[container-type:inline-size] relative mx-auto w-[132%] -translate-x-[13.6%] sm:w-full sm:translate-x-0"
              style={{ aspectRatio: '1082 / 806' }}
            >
              {ROWS.map((row, r) =>
                row.map((cell, c) => {
                  const left = c * PITCH_X + (r % 2 ? PITCH_X / 2 : 0)
                  const top = r * PITCH_Y
                  return (
                    <div
                      key={`${r}-${c}`}
                      data-cell
                      className="group absolute hover:z-10"
                      style={{
                        left: `${left}%`,
                        top: `${top}%`,
                        width: `${CELL_W}%`,
                        aspectRatio: '0.866',
                      }}
                    >
                      <CellFace cell={cell} />
                    </div>
                  )
                }),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CellFace({ cell }: { cell: Cell }) {
  const base =
    'absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.07]'
  const clip = { clipPath: HEX } as const

  if (cell.kind === 'photo') {
    return (
      <div aria-hidden="true" className={`${base} overflow-hidden`} style={clip}>
        <Image
          src={cell.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 15vw, 30vw"
          className="object-cover grayscale-[0.35] transition-[filter,transform] duration-700 group-hover:scale-[1.06] group-hover:grayscale-0"
        />
      </div>
    )
  }

  if (cell.kind === 'label') {
    return (
      <NextLink
        href={cell.href}
        className={`${base} text-fg-heading font-display flex items-center justify-center p-[14%] text-center text-[max(11px,2.05cqw)] leading-tight font-medium transition-colors focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-4`}
        style={{ ...clip, background: TONE[cell.tone] }}
        onMouseEnter={(e) => (e.currentTarget.style.background = TONE_HOVER[cell.tone])}
        onMouseLeave={(e) => (e.currentTarget.style.background = TONE[cell.tone])}
        onFocus={(e) => (e.currentTarget.style.background = TONE_HOVER[cell.tone])}
        onBlur={(e) => (e.currentTarget.style.background = TONE[cell.tone])}
      >
        {cell.text}
      </NextLink>
    )
  }

  if (cell.kind === 'center') {
    return (
      <button
        type="button"
        onClick={focusEmail}
        aria-label="Join the newsletter: go to the email field"
        className={`${base} flex flex-col items-center justify-center gap-2 text-white focus-visible:ring-4 focus-visible:ring-white/60 focus-visible:outline-none`}
        style={{ ...clip, background: 'var(--plum-800, var(--plum-900))' }}
      >
        <span className="font-display text-[max(22px,4.4cqw)] leading-none font-medium">You?</span>
        <span className="text-[max(9px,1.25cqw)] font-medium tracking-[0.2em] uppercase">
          Join the hive
        </span>
      </button>
    )
  }

  return (
    <div
      aria-hidden="true"
      onClick={focusEmail}
      className={`${base} text-fg-muted flex cursor-pointer items-center justify-center`}
      style={{
        ...clip,
        background: 'color-mix(in srgb, var(--color-fg-default) 6%, var(--color-canvas))',
      }}
    >
      <svg
        width="26%"
        viewBox="0 0 24 24"
        fill="none"
        className="transition-transform duration-500 group-hover:rotate-90"
      >
        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  )
}
