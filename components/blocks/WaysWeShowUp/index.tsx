'use client'

import { useRef } from 'react'
import { Reveal } from '@/components/motion/reveal'
import { useReducedMotion } from '@/components/motion/use-reduced-motion'
import type { WaysWeShowUpBlockData } from '@/lib/sanity/types'
import { AccessibleList } from './AccessibleList'
import { CardStack, type WaysLayout } from './CardStack'
import { SimpleCardList } from './SimpleCardList'
import { SubtleAutoShuffle } from './SubtleAutoShuffle'

/**
 * "Ways we show up" — scroll-pinned shuffling card stack (exaggerated
 * motion moment 3). See CardStack/useShuffleTimeline for the interaction;
 * AccessibleList is always rendered and is what assistive tech actually
 * reads (the animated stack is aria-hidden).
 */
/** "THREE WAYS\nWE SHOW UP" -> "Three ways we show up"; already-mixed-case copy is left alone. */
function sentenceCase(heading: string) {
  const flat = heading.replace(/\s*\n\s*/g, ' ').trim()
  return flat === flat.toUpperCase() ? flat.charAt(0) + flat.slice(1).toLowerCase() : flat
}

export function WaysWeShowUpBlock({
  data,
  layout = 'split',
}: {
  data: WaysWeShowUpBlockData
  layout?: WaysLayout
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const animation = data.animation ?? 'exaggerated'
  const showSticker = data.showSticker ?? true

  if (!data.cards || data.cards.length < 2) return null

  const showStaticList = animation === 'none' || reducedMotion

  // Alternative arrangements of the same animated stack. Each one owns where
  // its heading goes, so it's passed in rather than rendered above.
  if (layout !== 'stacked' && !showStaticList && animation === 'exaggerated') {
    const headingClass =
      layout === 'split'
        ? // same label as the About section's "● ABOUT US"
          'text-fg-default mb-6 flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] uppercase sm:mb-7 sm:text-[12px]'
        : layout === 'editorial'
          ? 'font-display text-fg-muted text-sm font-semibold tracking-[0.22em] uppercase'
          : 'font-display text-fg-heading text-[clamp(30px,3.4vw,50px)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance'
    const headingEl = (
      <h2 className={headingClass}>
        {layout === 'split' && (
          <span aria-hidden="true" className="bg-accent-orchid inline-block h-2 w-2 rounded-full" />
        )}
        {layout === 'editorial' ? data.heading.replace('\n', ' ') : sentenceCase(data.heading)}
      </h2>
    )
    return (
      <section
        ref={sectionRef}
        data-wwsu-section
        className="bg-subtle overflow-x-clip px-4 pt-24 pb-8 sm:px-[clamp(32px,5vw,80px)] sm:pt-24 sm:pb-10"
      >
        <div className="mx-auto max-w-[1240px]">
          {/* split: the label is a section header above the cards AND the copy, left-aligned like "● ABOUT US" */}
          {layout === 'split' && headingEl}
          <CardStack
            sectionRef={sectionRef}
            cards={data.cards}
            showSticker={showSticker}
            animation={animation}
            layout={layout}
            headingNode={layout === 'split' ? undefined : headingEl}
          />
          <AccessibleList cards={data.cards} />
        </div>
      </section>
    )
  }

  return (
    // Padding/gaps/heading size step down on mobile (<sm) specifically so
    // the exaggerated mode's PINNED section — frozen for the whole shuffle —
    // fits within ~100svh on a small phone (iPhone SE); below it, nothing
    // after the fold would ever become reachable since the page isn't
    // scrolling during the pin. See CardStack's description for the
    // matching line-clamp.
    <section
      ref={sectionRef}
      data-wwsu-section
      className="bg-subtle px-4 pt-24 pb-10 sm:px-8 sm:pt-32 sm:pb-20"
    >
      <div className="mx-auto max-w-[720px] text-center">
        <Reveal>
          <h2 className="font-display text-fg-heading text-3xl leading-[1.05] font-bold tracking-tight uppercase sm:text-5xl">
            {data.heading.split('\n').map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>
        </Reveal>

        <div className="mt-14 sm:mt-14">
          {showStaticList ? (
            <SimpleCardList cards={data.cards} />
          ) : animation === 'subtle' ? (
            <SubtleAutoShuffle cards={data.cards} />
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
