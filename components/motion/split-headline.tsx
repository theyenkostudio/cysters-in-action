'use client'

import gsap from 'gsap'
import { useLayoutEffect, useRef } from 'react'
import { useReducedMotion } from './use-reduced-motion'

/**
 * Exaggerated moment 1 (hero headline): splits the headline into lines and
 * words, rising from a mask line by line, word by word. Falls back to a
 * plain, already-visible heading under reduced motion (Section 4, Motion
 * principles #3).
 */
export function SplitHeadline({
  text,
  className,
  as: Tag = 'h1',
  delay = 0,
}: {
  text: string
  className?: string
  as?: 'h1' | 'h2'
  delay?: number
}) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()
  const lines = text.split('\n')

  // useLayoutEffect (not useEffect) so the hidden starting state is applied
  // before the browser paints — the SSR markup below renders fully visible,
  // so if this effect never runs (JS error, slow hydration, disabled JS) the
  // headline stays visible rather than failing closed to invisible.
  useLayoutEffect(() => {
    if (reducedMotion || !containerRef.current) return

    const wordEls = containerRef.current.querySelectorAll('[data-split-word]')
    // gsap.set (not a raw inline `transform` string in the SSR markup) so
    // GSAP owns the whole transform lifecycle — mixing a hand-written
    // `transform: translateY(120%)` with GSAP's yPercent tweening left the
    // Y-offset stuck at its starting value even after the tween reported
    // complete, clipping the word under its parent's overflow-hidden mask.
    gsap.set(wordEls, { yPercent: 120, opacity: 0 })
    const tween = gsap.to(wordEls, {
      yPercent: 0,
      opacity: 1,
      duration: 0.7,
      ease: 'expo.out',
      stagger: 0.035,
      delay,
    })

    return () => {
      tween.kill()
      gsap.set(wordEls, { clearProps: 'all' })
    }
  }, [reducedMotion, delay])

  return (
    <Tag className={className}>
      <span ref={containerRef} className="block">
        {lines.map((line, lineIndex) => (
          <span key={lineIndex} className="block">
            {line.split(' ').map((word, wordIndex) => (
              <span
                key={wordIndex}
                className="inline-block overflow-hidden pb-[0.1em] align-bottom"
              >
                <span data-split-word className="inline-block">
                  {word}
                  {wordIndex < line.split(' ').length - 1 ? ' ' : ''}
                </span>
              </span>
            ))}
          </span>
        ))}
      </span>
    </Tag>
  )
}
