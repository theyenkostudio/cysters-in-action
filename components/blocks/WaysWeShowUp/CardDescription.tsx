import { forwardRef, memo } from 'react'
import { ButtonLink } from '@/components/ui/button'
import { resolveHref } from '@/lib/link'
import type { PillarKey, ResolvedLinkValue, RichTextValue } from '@/lib/sanity/types'
import { PILLAR_TEXT_VAR } from './pillar-colors'

/** Class on highlighted words, queried by useShuffleTimeline to animate their colour in last. */
export const HIGHLIGHT_CLASS = 'wwsu-highlight'

type Word = { text: string; strong: boolean; highlight: boolean; space: boolean }
type Span = { text?: string; marks?: string[] }

/**
 * Flattens the rich text into words, remembering for each whether whitespace
 * followed it in the source (so punctuation in the next span, "answers" + ", with",
 * stays attached). React renders every word as its own span, so GSAP only ever
 * animates elements React already owns; nothing re-parents React's text nodes
 * (which is what SplitText did, and what caused the `removeChild` crashes).
 */
function toWords(value: RichTextValue): Word[] {
  const words: Word[] = []
  for (const block of value) {
    const children = (block.children as Span[] | undefined) ?? []
    for (const span of children) {
      const marks = span.marks ?? []
      const text = span.text ?? ''
      if (/^\s/.test(text) && words.length) words[words.length - 1].space = true
      for (const m of text.matchAll(/(\S+)(\s*)/g)) {
        words.push({
          text: m[1],
          strong: marks.includes('strong'),
          highlight: marks.includes('highlight'),
          space: m[2].length > 0,
        })
      }
    }
  }
  return words
}

export const CardDescription = memo(
  forwardRef<
    HTMLDivElement,
    {
      value: RichTextValue
      pillar: PillarKey
      link?: ResolvedLinkValue
      /** Line-clamp classes (mobile pins have limited height); layouts pass their own. */
      clampClass?: string
    }
  >(function CardDescription(
    { value, pillar, link, clampClass = 'line-clamp-7 sm:line-clamp-none' },
    ref,
  ) {
    const words = toWords(value)
    return (
      // No opacity/visibility styling here — useShuffleTimeline's gsap.set()
      // owns which description is shown from the moment it mounts (crossfade,
      // not a CSS toggle); mixing the two is exactly the bug class covered in
      // the comment on the `highlight` mark above.
      <div
        ref={ref}
        data-wwsu-description
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 ${clampClass}`}
      >
        <div data-wwsu-copy>
          {words.map((w, i) => (
            <span key={i}>
              <span
                className={`wwsu-word inline-block${w.strong ? 'font-semibold' : ''}${w.highlight ? ` ${HIGHLIGHT_CLASS}` : ''}`}
                // Coloured by default (not just once GSAP runs) so a card that's
                // already active on load, or any no-JS fallback, still reads right.
                style={w.highlight ? { color: PILLAR_TEXT_VAR[pillar] } : undefined}
              >
                {w.text}
              </span>
              {w.space ? ' ' : null}
            </span>
          ))}
        </div>
        {link && (
          // tabIndex=-1: this whole tree is aria-hidden (decorative — the
          // real, reachable link is AccessibleList's), so this one must not
          // be a phantom tab stop a sighted keyboard user can land on but a
          // screen reader user can't perceive.
          <div className="mt-5">
            <ButtonLink href={resolveHref(link)} tabIndex={-1} variant="outline" size="sm">
              {link.label || 'Learn more'}
            </ButtonLink>
          </div>
        )}
      </div>
    )
  }),
)
