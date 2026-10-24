import type { ArticleRef, GlossaryTermRef } from './sanity/types'

export type SearchResult = {
  type: 'article' | 'glossaryTerm'
  title: string
  description?: string
  href: string
  meta: string
}

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

function score(query: string, fields: (string | undefined)[]): number {
  let best = 0
  for (const field of fields) {
    if (!field) continue
    const value = normalize(field)
    if (value === query) best = Math.max(best, 4)
    else if (value.startsWith(query)) best = Math.max(best, 3)
    else if (value.includes(query)) best = Math.max(best, 2)
  }
  return best
}

/**
 * Plain substring relevance ranking across Learn articles and Glossary
 * terms (Phase 5: "Site search across Learn and Glossary"). Deliberately
 * not a fuzzy-match library — the content set is small and CMS-curated, and
 * every byte here ships on /search's first load (Section 8's JS budget).
 */
export function searchContent(
  rawQuery: string,
  articles: ArticleRef[],
  glossaryTerms: GlossaryTermRef[],
): SearchResult[] {
  const query = normalize(rawQuery)
  if (!query) return []

  const results: { result: SearchResult; score: number }[] = []

  for (const article of articles) {
    const s = score(query, [
      article.title,
      article.standfirst,
      article.category?.title,
      ...(article.tags ?? []),
    ])
    if (s > 0) {
      results.push({
        score: s,
        result: {
          type: 'article',
          title: article.title,
          description: article.standfirst,
          href: `/learn/${article.category.slug.current}/${article.slug.current}`,
          meta: article.category.title,
        },
      })
    }
  }

  for (const term of glossaryTerms) {
    const s = score(query, [term.term, term.shortDefinition, ...(term.alsoKnownAs ?? [])])
    if (s > 0) {
      results.push({
        score: s,
        result: {
          type: 'glossaryTerm',
          title: term.term,
          description: term.shortDefinition,
          href: `/learn/glossary/${term.slug.current}`,
          meta: 'Glossary',
        },
      })
    }
  }

  results.sort((a, b) => b.score - a.score || a.result.title.localeCompare(b.result.title))
  return results.map((r) => r.result)
}
