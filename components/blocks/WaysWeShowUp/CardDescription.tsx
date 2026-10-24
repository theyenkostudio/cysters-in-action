import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { forwardRef } from 'react'
import { resolveHref } from '@/lib/link'
import type { PillarKey, ResolvedLinkValue, RichTextValue } from '@/lib/sanity/types'
import { PILLAR_TEXT_VAR } from './pillar-colors'

/** The `highlight` mark's class — queried by useShuffleTimeline to animate
 * its colour in last, and relied on by SplitText to preserve it as a real
 * wrapping element around the split word spans it contains. */
export const HIGHLIGHT_CLASS = 'wwsu-highlight'

function descriptionComponents(pillar: PillarKey): PortableTextComponents {
  return {
    block: {
      normal: ({ children }) => <>{children}</>,
    },
    marks: {
      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      highlight: ({ children }) => (
        // Coloured inline by default (not just once GSAP runs) so a card
        // that's already the active one on load — or any no-JS fallback —
        // still reads correctly; the shuffle timeline's fromTo always sets
        // an explicit start AND end colour for the cards it animates, so
        // this never fights that tween (see the note in TornCard/
        // useShuffleTimeline on not mixing a CSS value with a later GSAP
        // tween of the *same, unspecified* starting point).
        <mark
          className={HIGHLIGHT_CLASS}
          style={{ color: PILLAR_TEXT_VAR[pillar], background: 'none' }}
        >
          {children}
        </mark>
      ),
    },
  }
}

export const CardDescription = forwardRef<
  HTMLDivElement,
  { value: RichTextValue; pillar: PillarKey; link?: ResolvedLinkValue }
>(function CardDescription({ value, pillar, link }, ref) {
  return (
    // No opacity/visibility styling here — useShuffleTimeline's gsap.set()
    // owns which description is shown from the moment it mounts (crossfade,
    // not a CSS toggle); mixing the two is exactly the bug class covered in
    // the comment on the `highlight` mark above.
    <div
      ref={ref}
      data-wwsu-description
      aria-hidden="true"
      className="absolute inset-x-0 top-0 line-clamp-5 sm:line-clamp-none"
    >
      <PortableText value={value} components={descriptionComponents(pillar)} />
      {link && (
        // tabIndex=-1: this whole tree is aria-hidden (decorative — the
        // real, reachable link is AccessibleList's), so this one must not
        // be a phantom tab stop a sighted keyboard user can land on but a
        // screen reader user can't perceive.
        <a
          href={resolveHref(link)}
          tabIndex={-1}
          className="text-fg-link hover:text-fg-link-hover mt-2 inline-block normal-case underline underline-offset-2"
        >
          Learn more
        </a>
      )}
    </div>
  )
})
