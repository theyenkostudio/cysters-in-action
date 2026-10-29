'use client'

import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { resolveHref } from '@/lib/link'
import type { WaysWeShowUpCardValue } from '@/lib/sanity/types'
import { tornCardClipPoints } from './torn-edge'
import { DistressedInkFilterDefs, DistressedWord } from './DistressedWord'
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
 * `animation: "subtle"` — no scroll-pin, no timer: the active card is read
 * straight off the container's own position in the viewport, recomputed on
 * scroll/resize. Nothing runs in the background — stop scrolling and it
 * stops moving, because there's no interval or tween driving it on its own.
 * A window scroll listener is only attached while the section is actually
 * near the viewport (gated by IntersectionObserver), so it costs nothing
 * for the rest of the page's scroll lifetime either.
 */
export function SubtleAutoShuffle({ cards }: { cards: WaysWeShowUpCardValue[] }) {
  const [active, setActive] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el || cards.length < 2) return

    let ticking = false
    const update = () => {
      ticking = false
      const rect = el.getBoundingClientRect()
      const span = window.innerHeight + rect.height
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / span))
      setActive(Math.min(cards.length - 1, Math.floor(progress * cards.length)))
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          update()
          window.addEventListener('scroll', onScroll, { passive: true })
          window.addEventListener('resize', onScroll)
        } else {
          window.removeEventListener('scroll', onScroll)
          window.removeEventListener('resize', onScroll)
        }
      },
      { rootMargin: '50% 0px' },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [cards.length])

  const card = cards[active]

  return (
    <div ref={containerRef}>
      {/* aria-hidden: AccessibleList is the one place a screen reader gets
         this content — see the same note on CardStack's root. */}
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
    </div>
  )
}
