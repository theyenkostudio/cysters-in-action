'use client'

import { useMemo, useState } from 'react'
import * as Accordion from '@radix-ui/react-accordion'
import { Input } from '@/components/ui/input'
import type { GlossaryTermRef } from '@/lib/sanity/types'

function letterOf(term: string) {
  return term.charAt(0).toUpperCase()
}

export function GlossaryAzList({ terms }: { terms: GlossaryTermRef[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return terms
    return terms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) || t.alsoKnownAs?.some((a) => a.toLowerCase().includes(q)),
    )
  }, [terms, query])

  const letters = useMemo(
    () => Array.from(new Set(terms.map((t) => letterOf(t.term)))).sort(),
    [terms],
  )
  const grouped = useMemo(() => {
    const map = new Map<string, GlossaryTermRef[]>()
    for (const term of filtered) {
      const letter = letterOf(term.term)
      map.set(letter, [...(map.get(letter) ?? []), term])
    }
    return map
  }, [filtered])

  return (
    <div>
      <Input
        type="search"
        placeholder="Search the glossary…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search glossary terms"
        className="max-w-sm"
      />

      <div className="mt-4 flex flex-wrap gap-1">
        {letters.map((letter) => (
          <a
            key={letter}
            href={`#letter-${letter}`}
            className="rounded-pill text-fg-muted hover:bg-muted flex h-8 w-8 items-center justify-center text-sm font-medium"
          >
            {letter}
          </a>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-fg-muted mt-10">No terms match &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="mt-8 space-y-8">
          {[...grouped.entries()].map(([letter, letterTerms]) => (
            <div key={letter} id={`letter-${letter}`}>
              <p className="font-display text-fg-heading text-xl font-semibold">{letter}</p>
              <Accordion.Root type="multiple" className="mt-2">
                {letterTerms.map((term) => (
                  <Accordion.Item
                    key={term._id}
                    value={term._id}
                    className="border-default border-b"
                  >
                    <Accordion.Header>
                      <Accordion.Trigger className="text-fg flex w-full items-center justify-between py-4 text-left font-medium">
                        {term.term}
                        <span
                          aria-hidden
                          className="transition-transform data-[state=open]:rotate-45"
                        >
                          +
                        </span>
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="pb-4">
                      {term.alsoKnownAs && term.alsoKnownAs.length > 0 && (
                        <p className="text-fg-subtle text-sm">
                          Also known as: {term.alsoKnownAs.join(', ')}
                        </p>
                      )}
                      <p className="text-fg-muted mt-1">{term.shortDefinition}</p>
                      <a
                        href={`/learn/glossary/${term.slug.current}`}
                        className="text-fg-link mt-2 inline-block text-sm underline"
                      >
                        Read more
                      </a>
                    </Accordion.Content>
                  </Accordion.Item>
                ))}
              </Accordion.Root>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
