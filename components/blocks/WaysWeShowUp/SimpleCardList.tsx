import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { resolveHref } from '@/lib/link'
import type { WaysWeShowUpCardValue } from '@/lib/sanity/types'
import { Reveal } from '@/components/motion/reveal'
import { tornCardClipPoints } from './torn-edge'
import { DistressedInkFilterDefs, DistressedWord } from './DistressedWord'
import { PILLAR_TEXT_VAR } from './pillar-colors'

// Alternating rotation — "slight rotations kept" per the reduced-motion spec,
// much smaller than the interactive stack's.
const ROTATIONS = [-2, 2, -1.5, 1.5, -1]

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
 * prefers-reduced-motion (or animation: "none") fallback: a plain vertical
 * list, no pin/scrub/shuffle — card, then its description, each a simple
 * fade-in on view. This is purely visual; AccessibleList (always present,
 * aria-hidden="true" here) is what assistive tech actually reads.
 */
export function SimpleCardList({ cards }: { cards: WaysWeShowUpCardValue[] }) {
  return (
    <div aria-hidden="true" className="mx-auto flex max-w-sm flex-col gap-12">
      <DistressedInkFilterDefs />
      {cards.map((card, i) => {
        const clipId = `torn-edge-list-${i}`
        return (
          <Reveal key={i} delay={i * 0.05}>
            <div
              className="relative aspect-[3/2] w-full"
              style={{
                transform: `rotate(${ROTATIONS[i % ROTATIONS.length]}deg)`,
                filter: 'drop-shadow(0 14px 22px rgb(0 0 0 / 0.25))',
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
                  src={card.image.url}
                  alt={card.image.alt ?? ''}
                  fill
                  sizes="400px"
                  className="object-cover"
                  style={{ filter: 'grayscale(1) contrast(1.15)' }}
                />
                <div className="absolute inset-0 flex items-center justify-center px-4">
                  <DistressedWord word={card.word} />
                </div>
              </div>
            </div>
            <div className="text-fg-default mt-4 max-w-[90%] text-center text-[13px] tracking-[0.08em] uppercase">
              <PortableText value={card.description} components={components(card.pillar)} />
              {card.link && (
                // tabIndex=-1 — see the same note in CardDescription.tsx;
                // the reachable link lives in AccessibleList.
                <a
                  href={resolveHref(card.link)}
                  tabIndex={-1}
                  className="text-fg-link hover:text-fg-link-hover mt-2 inline-block normal-case underline underline-offset-2"
                >
                  Learn more
                </a>
              )}
            </div>
          </Reveal>
        )
      })}
    </div>
  )
}
