'use client'

import { useRef } from 'react'
import { Reveal } from '@/components/motion/reveal'
import { useReducedMotion } from '@/components/motion/use-reduced-motion'
import type { WaysWeShowUpBlockData } from '@/lib/sanity/types'
import { AccessibleList } from './AccessibleList'
import { CardStack } from './CardStack'
import { SimpleCardList } from './SimpleCardList'
import { SubtleAutoShuffle } from './SubtleAutoShuffle'

/**
 * "Ways we show up" — scroll-pinned shuffling card stack (exaggerated
 * motion moment 3). See CardStack/useShuffleTimeline for the interaction;
 * AccessibleList is always rendered and is what assistive tech actually
 * reads (the animated stack is aria-hidden).
 */
export function WaysWeShowUpBlock({ data }: { data: WaysWeShowUpBlockData }) {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const animation = data.animation ?? 'exaggerated'
  const showSticker = data.showSticker ?? true

  if (!data.cards || data.cards.length < 2) return null

  const showStaticList = animation === 'none' || reducedMotion

  return (
    // Padding/gaps/heading size step down on mobile (<sm) specifically so
    // the exaggerated mode's PINNED section — frozen for the whole shuffle —
    // fits within ~100svh on a small phone (iPhone SE); below it, nothing
    // after the fold would ever become reachable since the page isn't
    // scrolling during the pin. See CardStack's description for the
    // matching line-clamp.
    <section ref={sectionRef} data-wwsu-section className="bg-subtle px-4 py-10 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-[720px] text-center">
        <Reveal>
          <p className="flex flex-col items-center gap-1">
            {data.eyebrowNumber && (
              <span className="text-orchid-text text-sm font-semibold tracking-[0.1em]">
                {data.eyebrowNumber}
              </span>
            )}
            {data.eyebrow && (
              <span className="text-fg-muted text-xs font-medium tracking-[0.2em] uppercase">
                {data.eyebrow}
              </span>
            )}
          </p>
          <h2 className="font-display text-fg-heading mt-2 text-3xl leading-[1.05] font-bold tracking-tight uppercase sm:mt-3 sm:text-5xl">
            {data.heading.split('\n').map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>
        </Reveal>

        <div className="mt-6 sm:mt-12">
          {showStaticList ? (
            <SimpleCardList cards={data.cards} />
          ) : animation === 'subtle' ? (
            <SubtleAutoShuffle cards={data.cards} showSticker={showSticker} />
          ) : (
            <CardStack
              sectionRef={sectionRef}
              cards={data.cards}
              showSticker={showSticker}
              animation={animation}
            />
          )}
        </div>

        <AccessibleList cards={data.cards} />
      </div>
    </section>
  )
}
