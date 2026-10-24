import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { resolveHref } from '@/lib/link'
import type { WaysWeShowUpCardValue } from '@/lib/sanity/types'
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
 * Full content, in order, for assistive tech — always present (not just
 * under reduced motion): the animated stack is `aria-hidden`, so this is
 * the only place a screen reader ever reads these words/descriptions.
 */
export function AccessibleList({ cards }: { cards: WaysWeShowUpCardValue[] }) {
  return (
    <ol className="sr-only">
      {cards.map((card, i) => (
        <li key={i}>
          <h3>{card.word}</h3>
          <PortableText value={card.description} components={components(card.pillar)} />
          {card.link && <a href={resolveHref(card.link)}>Learn more</a>}
        </li>
      ))}
    </ol>
  )
}
