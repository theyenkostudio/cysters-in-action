'use client'

import { Heart } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { tornCardClipPoints } from '@/components/blocks/WaysWeShowUp/torn-edge'
import { useGsapScope } from '@/components/motion/use-gsap-scope'
import { useReducedMotion } from '@/components/motion/use-reduced-motion'
import { ButtonLink } from '@/components/ui/button'
import type { StoryRef } from '@/lib/sanity/types'
import { storyByline, storyDate, storyParagraphs } from './story-utils'

const PAPER = [
  'color-mix(in srgb, var(--orchid-500) 9%, var(--color-canvas))',
  'color-mix(in srgb, var(--color-canvas) 100%, white)',
  'color-mix(in srgb, var(--lagoon-500) 9%, var(--color-canvas))',
]
const TILT = [-2.4, 1.6, -1.2]
const LIFT = ['lg:translate-y-0', 'lg:translate-y-8', 'lg:translate-y-2']

type Api = { flip: (from: number | null, to: number | null) => void }

/**
 * Stories as postcards. The front is the pull-quote on torn paper with a
 * postmark (country + date) and a stamp; click or press Enter and it turns
 * over to show the opening of the letter, ruled like writing paper. Cards are
 * "dealt" onto the page when the section arrives and straighten on hover.
 */
export function StoryPostcards({
  stories,
  label = 'Community stories',
  intro = 'Letters from people who\u2019ve been where you are.',
  cta,
  animated = true,
}: {
  stories: StoryRef[]
  label?: string
  intro?: string
  cta?: { label: string; href: string }
  animated?: boolean
}) {
  const reducedMotion = useReducedMotion()
  const reduced = reducedMotion || !animated
  const ref = useRef<HTMLElement>(null)
  const apiRef = useRef<Api | null>(null)
  const prevRef = useRef<number | null>(null)
  const [open, setOpen] = useState<number | null>(null)
  const cards = stories.slice(0, 3)

  useGsapScope(
    ref,
    ({ gsap, ScrollTrigger }) => {
      const q = gsap.utils.selector(ref.current!)
      const cardEls = q('[data-card]')
      const inners = q('[data-inner]')
      const fades = q('[data-fade]')
      gsap.set(inners, { rotationY: 0, transformPerspective: 1400 })
      gsap.set(cardEls, { y: 70, opacity: 0, rotate: (i: number) => TILT[i] * 4 })
      gsap.set(fades, { opacity: 0, y: 14 })
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 70%',
        once: true,
        onEnter: () => {
          gsap.to(fades, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' })
          gsap.to(cardEls, {
            y: 0,
            opacity: 1,
            rotate: (i: number) => TILT[i],
            duration: 1.1,
            stagger: 0.14,
            ease: 'expo.out',
            delay: 0.15,
          })
        },
      })
      apiRef.current = {
        flip: (from, to) => {
          if (from !== null && from !== to)
            gsap.to(inners[from], {
              rotationY: 0,
              duration: 0.8,
              ease: 'power3.inOut',
              overwrite: true,
            })
          if (to !== null)
            gsap.to(inners[to], {
              rotationY: 180,
              duration: 0.9,
              ease: 'power3.inOut',
              overwrite: true,
            })
        },
      }
      return () => {
        apiRef.current = null
      }
    },
    !reduced,
    [cards.length],
  )

  useEffect(() => {
    apiRef.current?.flip(prevRef.current, open)
    prevRef.current = open
  }, [open])

  if (cards.length === 0) return null

  return (
    <section ref={ref} className="bg-canvas px-4 py-20 sm:px-[clamp(32px,5vw,80px)] sm:py-28">
      <div className="mx-auto max-w-[1240px]">
        <h2
          data-fade
          className="text-fg-default flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] uppercase sm:text-[12px]"
        >
          <span aria-hidden="true" className="bg-accent-orchid inline-block h-2 w-2 rounded-full" />
          {label}
        </h2>
        <p
          data-fade
          className="font-display text-fg-heading mt-5 max-w-[22ch] text-[clamp(30px,3.6vw,52px)] leading-[1.06] font-semibold tracking-[-0.025em] text-balance"
        >
          {intro}
        </p>

        <ul
          className={`mt-14 grid gap-10 md:grid-cols-2 lg:gap-8 ${
            cards.length >= 3 ? 'lg:grid-cols-3' : 'lg:mx-auto lg:max-w-[860px]'
          }`}
        >
          {cards.map((story, i) => {
            const isOpen = open === i
            const paras = storyParagraphs(story)
            const clipId = `story-torn-${i}`
            return (
              <li
                key={story._id}
                data-card
                className={`group mx-auto w-full max-w-[400px] [perspective:1400px] ${LIFT[i]}`}
              >
                <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
                  <defs>
                    <clipPath id={clipId} clipPathUnits="objectBoundingBox">
                      <polygon points={tornCardClipPoints(i + 11)} />
                    </clipPath>
                  </defs>
                </svg>

                <div className="[filter:drop-shadow(0_18px_26px_rgb(19_77_100/0.22))] transition-transform duration-500 group-hover:-translate-y-2">
                  <div
                    data-inner
                    className="relative aspect-[4/5] [transform-style:preserve-3d]"
                    style={reduced ? { transform: `rotateY(${isOpen ? 180 : 0}deg)` } : undefined}
                  >
                    {/* FRONT */}
                    <div
                      className="absolute inset-0 [backface-visibility:hidden]"
                      style={{ clipPath: `url(#${clipId})`, background: PAPER[i] }}
                      inert={isOpen}
                    >
                      <Postmark story={story} />
                      <Stamp />
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpen(isOpen ? null : i)}
                        className="focus-visible:ring-focus-ring absolute inset-0 z-10 flex flex-col justify-end p-7 text-left focus-visible:ring-4 focus-visible:outline-none focus-visible:ring-inset sm:p-8"
                      >
                        <span className="font-display text-fg-heading text-[clamp(24px,2.2vw,31px)] leading-[1.12] font-medium tracking-[-0.02em] text-balance">
                          &ldquo;{story.pullQuote ?? story.title}&rdquo;
                        </span>
                        <span className="text-fg-muted mt-5 block text-sm">
                          {storyByline(story)}
                        </span>
                        <span className="text-fg-heading mt-3 inline-flex items-center gap-1.5 text-sm font-medium">
                          Open the letter
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          >
                            <path
                              d="M5 12h14M13 6l6 6-6 6"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </button>
                    </div>

                    {/* BACK: the letter */}
                    <div
                      className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]"
                      style={{ clipPath: `url(#${clipId})`, background: PAPER[(i + 1) % 3] }}
                      inert={!isOpen}
                    >
                      <div
                        className="flex h-full flex-col px-7 pt-9 pb-7 sm:px-8"
                        style={{
                          backgroundImage:
                            'repeating-linear-gradient(to bottom, transparent 0, transparent 29px, color-mix(in srgb, var(--color-fg-default) 11%, transparent) 29px, color-mix(in srgb, var(--color-fg-default) 11%, transparent) 30px)',
                          backgroundPosition: '0 14px',
                        }}
                      >
                        <p className="text-fg-muted text-xs font-medium tracking-[0.14em] uppercase">
                          {storyByline(story)}
                          {story.country ? ` · ${story.country}` : ''}
                        </p>
                        {story.contentWarning && (
                          <p className="text-fg-muted mt-1 text-xs">
                            Content note: {story.contentWarning}
                          </p>
                        )}
                        <div className="text-fg mt-3 min-h-0 flex-1 overflow-hidden text-[16px] leading-[30px]">
                          {paras.slice(0, 2).map((p, pi) => (
                            <p key={pi} className="line-clamp-4">
                              {p}
                            </p>
                          ))}
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-3">
                          {story.slug && (
                            <ButtonLink
                              href={`/connect/stories/${story.slug.current}`}
                              variant="solid"
                              size="sm"
                            >
                              Read the full letter
                            </ButtonLink>
                          )}
                          <button
                            type="button"
                            onClick={() => setOpen(null)}
                            className="text-fg-muted hover:text-fg text-sm underline underline-offset-4"
                          >
                            Turn it back
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
        {cta && (
          <div data-fade className="mt-16 sm:mt-20">
            <ButtonLink href={cta.href} variant="solid">
              {cta.label}
            </ButtonLink>
          </div>
        )}
      </div>
    </section>
  )
}

function Stamp() {
  return (
    <div
      aria-hidden="true"
      className="absolute top-6 right-6 flex h-[72px] w-[58px] items-center justify-center bg-[var(--color-canvas)] p-1.5 [outline:3px_dotted_color-mix(in_srgb,var(--color-fg-default)_35%,transparent)] [outline-offset:-1px]"
    >
      <div
        className="flex h-full w-full items-center justify-center"
        style={{ background: 'color-mix(in srgb, var(--orchid-500) 85%, black 6%)' }}
      >
        <Heart className="h-6 w-6 fill-white text-white" strokeWidth={1.5} />
      </div>
    </div>
  )
}

function Postmark({ story }: { story: StoryRef }) {
  const place = (story.country ?? 'Community').toUpperCase()
  const id = `pm-${story._id}`
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 70"
      className="text-orchid-text absolute top-3 right-[84px] h-[96px] w-[166px] -rotate-6 opacity-80"
    >
      <defs>
        <path id={id} d="M12,35 a23,23 0 1,1 46,0 a23,23 0 1,1 -46,0" />
      </defs>
      <circle cx="35" cy="35" r="30" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="35" cy="35" r="19" fill="none" stroke="currentColor" strokeWidth="1" />
      <text fontSize="7" fontWeight="600" fill="currentColor" fontFamily="inherit">
        <textPath href={`#${id}`} textLength="140" lengthAdjust="spacing">
          {`${place} · ${storyDate(story)} ·`}
        </textPath>
      </text>
      {[22, 34, 46].map((y) => (
        <path
          key={y}
          d={`M70,${y} q6,-5 12,0 t12,0 t12,0 t12,0`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      ))}
    </svg>
  )
}
