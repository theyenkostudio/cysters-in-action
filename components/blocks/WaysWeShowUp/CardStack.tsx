'use client'

import { PortableText } from '@portabletext/react'
import { useRef, type ReactNode, type RefObject } from 'react'
import { useMediaQuery } from '@/components/motion/use-media-query'
import type { RichTextValue, WaysWeShowUpCardValue } from '@/lib/sanity/types'
import { CardDescription, HIGHLIGHT_CLASS } from './CardDescription'
import { DistressedInkFilterDefs } from './DistressedWord'
import { Sticker } from './Sticker'
import { TornCard } from './TornCard'
import { useShuffleTimeline } from './useShuffleTimeline'

/**
 * How the stack, the copy and the progress are arranged. All layouts share
 * the same refs and the same timeline, so cards and text move together in
 * every one of them.
 */
export type WaysLayout = 'stacked' | 'split' | 'editorial' | 'caption'

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
  layout = 'stacked',
  headingNode,
}: {
  sectionRef: RefObject<HTMLElement | null>
  cards: WaysWeShowUpCardValue[]
  showSticker: boolean
  animation: 'none' | 'subtle' | 'exaggerated'
  layout?: WaysLayout
  /** The section's <h2>, placed by the layout (stacked renders its own above). */
  headingNode?: ReactNode
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

  const stack = (className: string) => (
    <div ref={stackRef} className={className}>
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
  )

  const copy = (className: string, clamp = 'line-clamp-7 sm:line-clamp-none') => (
    <div className={className}>
      {/* Reserves real layout height for the tallest description: the actual
          descriptions below are `position: absolute` (so they can crossfade
          over each other), so none contributes height on its own. `invisible`
          keeps the space without painting it. */}
      <div aria-hidden="true" className={`invisible ${clamp}`}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- RichTextValue is intentionally loosely typed (see lib/sanity/types.ts); @portabletext/react's own types want a narrower TypedObject shape */}
        <PortableText value={longestCard.description as any} />
        {anyCardHasLink && <div className="mt-5 h-9" />}
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
          clampClass={clamp}
        />
      ))}
    </div>
  )

  const progress = (align: 'center' | 'start') => (
    <div
      className={`mt-3 flex flex-col gap-3 sm:mt-6 ${align === 'center' ? 'items-center' : 'items-start'}`}
    >
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
  )

  // The interactive stack + its live descriptions/progress are entirely
  // aria-hidden — AccessibleList (rendered by the parent block) is the one
  // place a screen reader gets this content, in plain reading order.
  if (layout === 'split') {
    return (
      <div className="grid items-center gap-8 text-left md:grid-cols-12 md:gap-x-14">
        <div aria-hidden="true" className="mt-2 md:col-span-6 md:mt-0">
          <DistressedInkFilterDefs />
          {stack('relative mx-auto aspect-[3/2] w-[min(100%,500px,54svh)]')}
        </div>
        <div className="md:col-span-6">
          <div aria-hidden="true">
            {copy(
              'text-fg-default relative text-[15px] leading-[1.4] sm:text-[clamp(20px,1.9vw,28px)] sm:leading-[1.38]',
              'line-clamp-9 md:line-clamp-none',
            )}
            {progress('start')}
          </div>
        </div>
      </div>
    )
  }

  if (layout === 'editorial') {
    return (
      <div className="grid items-center gap-8 text-left md:grid-cols-12 md:gap-x-14 md:gap-y-8">
        <div className="md:col-span-12">{headingNode}</div>
        <div aria-hidden="true" className="md:col-span-5 md:col-start-8 md:row-start-2">
          <DistressedInkFilterDefs />
          {stack(
            'relative mx-auto mt-10 aspect-[3/2] w-[min(100%,440px,44svh)] md:mt-0 md:-rotate-1',
          )}
        </div>
        <div aria-hidden="true" className="md:col-span-7 md:col-start-1 md:row-start-2">
          {copy(
            'text-fg-heading font-display relative text-[17px] leading-[1.3] font-medium tracking-[-0.01em] sm:text-[clamp(26px,2.9vw,46px)] sm:leading-[1.12] sm:tracking-[-0.02em]',
            'line-clamp-9 md:line-clamp-none',
          )}
          {progress('start')}
        </div>
      </div>
    )
  }

  if (layout === 'caption') {
    return (
      <div className="text-center">
        {headingNode}
        <div aria-hidden="true" className="mt-12 sm:mt-14">
          <DistressedInkFilterDefs />
          {stack('relative mx-auto aspect-[16/9] w-[min(100%,700px,calc(36svh*1.78))]')}
          <div className="bg-canvas relative z-30 mx-auto -mt-10 w-[min(94%,620px)] rounded-[24px] px-6 py-6 text-center shadow-[0_28px_60px_-24px_rgb(19_77_100/0.45)] sm:-mt-16 sm:px-9 sm:py-8">
            {copy(
              'text-fg-default relative text-[15px] leading-[1.4] sm:text-[clamp(18px,1.5vw,22px)] sm:leading-[1.42]',
              'line-clamp-10 sm:line-clamp-none',
            )}
          </div>
          {progress('center')}
        </div>
      </div>
    )
  }

  return (
    <div aria-hidden="true">
      <DistressedInkFilterDefs />
      {stack(
        'relative mx-auto aspect-[3/2] w-[min(88vw,520px,38svh)] sm:w-[min(88vw,520px,50svh)]',
      )}
      {copy(
        'text-fg-default relative mx-auto mt-5 max-w-[40rem] px-4 text-center text-[15px] leading-[1.4] sm:mt-9 sm:text-[clamp(20px,1.7vw,26px)] sm:leading-[1.4]',
      )}
      {progress('center')}
    </div>
  )
}
