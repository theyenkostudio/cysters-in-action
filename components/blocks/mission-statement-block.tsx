'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'
import { Eyebrow } from '@/components/ui/eyebrow'
import { ButtonLink } from '@/components/ui/button'
import { useReducedMotion } from '@/components/motion/use-reduced-motion'
import { resolveHref } from '@/lib/link'
import type { CtaValue } from '@/lib/sanity/types'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const COLOUR_VARS: Record<string, string> = {
  teal: 'var(--color-fg-heading)',
  orchid: 'var(--color-orchid-text)',
  lagoon: 'var(--color-lagoon-text)',
}

export type MissionStatementData = {
  eyebrow?: string
  statement: string
  highlightWords?: { word: string; colour: 'teal' | 'orchid' | 'lagoon' }[]
  cta?: CtaValue
  animation?: 'none' | 'subtle' | 'exaggerated'
}

export function MissionStatementBlock({ data }: { data: MissionStatementData }) {
  const containerRef = useRef<HTMLParagraphElement>(null)
  const reducedMotion = useReducedMotion()
  const exaggerated = data.animation === 'exaggerated' && !reducedMotion
  const words = data.statement.split(' ')
  const highlightMap = new Map(
    (data.highlightWords ?? []).map((h) => [h.word.replace(/[.,]/g, ''), h.colour]),
  )

  useEffect(() => {
    if (!exaggerated || !containerRef.current) return

    const wordEls = containerRef.current.querySelectorAll<HTMLElement>('[data-word]')
    gsap.set(wordEls, { color: 'var(--color-fg-subtle)', opacity: 0.5 })

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
        end: 'bottom 40%',
        scrub: true,
      },
    })

    wordEls.forEach((el, i) => {
      const colour = highlightMap.get(el.dataset.word ?? '')
      timeline.to(
        el,
        { color: colour ? COLOUR_VARS[colour] : 'var(--color-fg)', opacity: 1, duration: 1 },
        i * 0.6,
      )
    })

    return () => {
      timeline.scrollTrigger?.kill()
      timeline.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- highlightMap/words are derived from data.statement, stable per render
  }, [exaggerated])

  return (
    <section className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-8">
      {data.eyebrow && <Eyebrow>{data.eyebrow}</Eyebrow>}
      <p
        ref={containerRef}
        className="font-display text-fg mt-6 text-2xl leading-relaxed font-medium sm:text-3xl md:text-4xl"
      >
        {words.map((word, i) => {
          const clean = word.replace(/[.,]/g, '')
          const colour = highlightMap.get(clean)
          return (
            <span
              key={i}
              data-word={clean}
              className={
                colour && !exaggerated
                  ? colour === 'teal'
                    ? 'text-fg-heading'
                    : colour === 'orchid'
                      ? 'text-orchid-text'
                      : 'text-lagoon-text'
                  : undefined
              }
            >
              {word}{' '}
            </span>
          )
        })}
      </p>
      {data.cta?.link && (
        <ButtonLink
          href={resolveHref(data.cta.link)}
          variant={data.cta.style ?? 'solid'}
          className="mt-8"
        >
          {data.cta.link.label}
        </ButtonLink>
      )}
    </section>
  )
}
