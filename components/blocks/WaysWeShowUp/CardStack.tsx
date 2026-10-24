'use client'

import { PortableText } from '@portabletext/react'
import { useRef, type RefObject } from 'react'
import { useMediaQuery } from '@/components/motion/use-media-query'
import type { RichTextValue, WaysWeShowUpCardValue } from '@/lib/sanity/types'
import { CardDescription, HIGHLIGHT_CLASS } from './CardDescription'
import { DistressedInkFilterDefs } from './DistressedWord'
import { Sticker } from './Sticker'
import { TornCard } from './TornCard'
import { useShuffleTimeline } from './useShuffleTimeline'

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function plainTextLength(value: RichTextValue): number {
  return value
    .flatMap((block) => (Array.isArray(block.children) ? block.children : []))
    .reduce((total: number, span) => {
      const text = typeof span === 'object' && span && 'text' in span ? String(span.text ?? '') : ''
      return total + text.length
    }, 0)
}

export function CardStack({
  sectionRef,
  cards,
  showSticker,
  animation,
}: {
  sectionRef: RefObject<HTMLElement | null>
  cards: WaysWeShowUpCardValue[]
  showSticker: boolean
  animation: 'none' | 'subtle' | 'exaggerated'
}) {
  const stackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const descRefs = useRef<(HTMLDivElement | null)[]>([])
  const progressLabelRefs = useRef<(HTMLSpanElement | null)[]>([])
  const progressBarFillRefs = useRef<(HTMLDivElement | null)[]>([])
  const stickerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 767px)')
  const longestCard = cards.reduce((longest, card) =>
    plainTextLength(card.description) > plainTextLength(longest.description) ? card : longest,
  )
  const anyCardHasLink = cards.some((card) => card.link)

  useShuffleTimeline({
    enabled: animation === 'exaggerated',
    sectionRef,
    stackRef,
    cardRefs,
    descRefs,
    highlightClass: HIGHLIGHT_CLASS,
    progressLabelRefs,
    progressBarFillRefs,
    stickerRef,
    cards,
    isMobile,
  })

  return (
    // The interactive stack + its live descriptions/progress are entirely
    // aria-hidden — AccessibleList (rendered by the parent block) is the
    // one place a screen reader gets this content, in plain reading order.
    <div aria-hidden="true">
      <DistressedInkFilterDefs />

      <div
        ref={stackRef}
        className="relative mx-auto aspect-[3/2] w-[88vw] max-w-[520px] sm:w-[520px]"
      >
        {cards.map((card, i) => (
          <TornCard
            key={i}
            index={i}
            image={card.image}
            word={card.word}
            priority={i === 0}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
          />
        ))}
        {showSticker && <Sticker ref={stickerRef} pillar={cards[0].pillar} />}
      </div>

      <div className="text-fg-default relative mx-auto mt-4 max-w-[560px] px-4 text-center text-[13px] tracking-[0.08em] uppercase sm:mt-8 sm:text-sm">
        {/* Reserves real layout height for the tallest description: the
            actual descriptions below are all `position: absolute` (so they
            can crossfade over each other), which means none of them
            contributes to this container's height on its own — without
            this, the container collapsed to a fixed min-height that was too
            short for 5 lines of tracked uppercase text, so the tail of a
            longer description visually overlapped the progress indicator
            underneath it. `invisible` keeps the layout space without
            painting it (and without a11y exposure, consistent with the
            whole stack already being aria-hidden one level up). */}
        <div aria-hidden="true" className="invisible line-clamp-5 sm:line-clamp-none">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- RichTextValue is intentionally loosely typed (see lib/sanity/types.ts); @portabletext/react's own types want a narrower TypedObject shape */}
          <PortableText value={longestCard.description as any} />
          {anyCardHasLink && <span className="mt-2 inline-block">Learn more</span>}
        </div>
        {cards.map((card, i) => (
          <CardDescription
            key={i}
            ref={(el) => {
              descRefs.current[i] = el
            }}
            value={card.description}
            pillar={card.pillar}
            link={card.link}
          />
        ))}
      </div>

      <div className="mt-3 flex flex-col items-center gap-3 sm:mt-6">
        <span className="text-fg-muted text-[13px] tracking-[0.1em]">
          <span className="relative inline-block">
            <span aria-hidden="true" className="invisible">
              {pad2(1)}
            </span>
            {cards.map((_, i) => (
              <span
                key={i}
                ref={(el) => {
                  progressLabelRefs.current[i] = el
                }}
                className="absolute inset-0"
              >
                {pad2(i + 1)}
              </span>
            ))}
          </span>
          {' / '}
          {pad2(cards.length)}
        </span>

        <div className="flex gap-1.5">
          {cards.map((_, i) => (
            <div key={i} className="bg-muted h-1 w-6 overflow-hidden rounded-full">
              <div
                ref={(el) => {
                  progressBarFillRefs.current[i] = el
                }}
                className="bg-fg-heading h-full w-full origin-left"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
