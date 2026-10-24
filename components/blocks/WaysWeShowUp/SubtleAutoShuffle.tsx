'use client'

import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { resolveHref } from '@/lib/link'
import type { WaysWeShowUpCardValue } from '@/lib/sanity/types'
import { tornCardClipPoints } from './torn-edge'
import { DistressedInkFilterDefs, DistressedWord } from './DistressedWord'
import { Sticker } from './Sticker'
import { PILLAR_TEXT_VAR } from './pillar-colors'

function components(pillar: WaysWeShowUpCardValue['pillar']): PortableTextComponents {
  return {
    block: { normal: ({ children }) => <p>{children}</p> },
    marks: {
      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      highlight: ({ children }) => (
        <mark style={{ color: PILLAR_TEXT_VAR[pillar], background: 'none' }}>{children}</mark>
      ),
    },
  }
}

/**
 * `animation: "subtle"` — no scroll-pin. A single active card crossfades
 * to the next every 4s while the section is in view, pausing on hover and
 * while off-screen, plus a real Pause/Play button (WCAG 2.2.2: this is the
 * one piece of content on the site that moves on its own for more than 5s,
 * so mouse-hover alone isn't enough — keyboard and touch users need a way
 * to stop it too). Deliberately simpler than the exaggerated stack's GSAP
 * master timeline (no multi-card depth stacking/word punch/sticker wobble)
 * — a lighter-weight CSS-transition crossfade.
 */
export function SubtleAutoShuffle({
  cards,
  showSticker,
}: {
  cards: WaysWeShowUpCardValue[]
  showSticker: boolean
}) {
  const [active, setActive] = useState(0)
  const [hoverPaused, setHoverPaused] = useState(false)
  const [manuallyPaused, setManuallyPaused] = useState(false)
  const [inView, setInView] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const paused = hoverPaused || manuallyPaused

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.4,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (paused || !inView || cards.length < 2) return
    const id = setInterval(() => setActive((i) => (i + 1) % cards.length), 4000)
    return () => clearInterval(id)
  }, [paused, inView, cards.length])

  const card = cards[active]

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
    >
      {/* aria-hidden: AccessibleList is the one place a screen reader gets
         this content — see the same note on CardStack's root. The pause
         button below is the one real control in this subtree (WCAG 2.2.2:
         this auto-advances indefinitely, so it needs a keyboard/touch-
         reachable pause, not just mouse-hover). */}
      <div aria-hidden="true">
        <DistressedInkFilterDefs />
        <div className="relative mx-auto aspect-[3/2] w-[88vw] max-w-[520px] sm:w-[520px]">
          {cards.map((c, i) => {
            const clipId = `torn-edge-subtle-${i}`
            return (
              <div
                key={i}
                aria-hidden="true"
                className="absolute inset-0 transition-opacity duration-700"
                style={{
                  opacity: i === active ? 1 : 0,
                  filter: 'drop-shadow(0 18px 28px rgb(0 0 0 / 0.28))',
                }}
              >
                <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
                  <defs>
                    <clipPath id={clipId} clipPathUnits="objectBoundingBox">
                      <polygon points={tornCardClipPoints(i)} />
                    </clipPath>
                  </defs>
                </svg>
                <div
                  className="bg-canvas absolute inset-0 scale-[1.015]"
                  style={{ clipPath: `url(#${clipId})` }}
                />
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `url(#${clipId})` }}
                >
                  <Image
                    src={c.image.url}
                    alt={c.image.alt ?? ''}
                    fill
                    sizes="(min-width: 768px) 520px, 88vw"
                    className="object-cover"
                    style={{ filter: 'grayscale(1) contrast(1.15)' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center px-4">
                    <DistressedWord word={c.word} />
                  </div>
                </div>
              </div>
            )
          })}
          {showSticker && <Sticker pillar={card.pillar} />}
        </div>

        <div
          aria-hidden="true"
          className="text-fg-default mx-auto mt-8 max-w-[560px] px-4 text-center text-[13px] tracking-[0.08em] uppercase transition-opacity duration-500"
          key={active}
        >
          <PortableText value={card.description} components={components(card.pillar)} />
          {card.link && (
            // tabIndex=-1 — see the same note in CardDescription.tsx; the
            // reachable link lives in AccessibleList.
            <a
              href={resolveHref(card.link)}
              tabIndex={-1}
              className="text-fg-link hover:text-fg-link-hover mt-2 inline-block normal-case underline underline-offset-2"
            >
              Learn more
            </a>
          )}
        </div>

        <div aria-hidden="true" className="mt-6 flex flex-col items-center gap-3">
          <span className="text-fg-muted text-[13px] tracking-[0.1em]">
            {String(active + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}
          </span>
          <div className="flex gap-1.5">
            {cards.map((_, i) => (
              <div key={i} className="bg-muted h-1 w-6 overflow-hidden rounded-full">
                <div
                  className="bg-fg-heading h-full origin-left transition-transform duration-500"
                  style={{ transform: `scaleX(${i === active ? 1 : 0})` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {cards.length > 1 && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            data-testid="shuffle-pause-button"
            onClick={() => setManuallyPaused((p) => !p)}
            aria-pressed={manuallyPaused}
            aria-label={manuallyPaused ? 'Resume automatic preview' : 'Pause automatic preview'}
            className="text-fg-muted hover:text-fg flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs"
          >
            {manuallyPaused ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M6 4l15 8-15 8z" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
              </svg>
            )}
            {manuallyPaused ? 'Play' : 'Pause'}
          </button>
        </div>
      )}
    </div>
  )
}
