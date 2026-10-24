import { describe, expect, it } from 'vitest'
import { searchContent } from './search'
import type { ArticleRef, GlossaryTermRef } from './sanity/types'

const category = {
  _id: 'cat-1',
  _type: 'category' as const,
  title: 'Understanding PMOS',
  slug: { current: 'understanding-pmos' },
}

const articles: ArticleRef[] = [
  {
    _id: 'a1',
    _type: 'article',
    title: 'What is PMOS? A plain-language guide',
    slug: { current: 'what-is-pmos-a-plain-language-guide' },
    articleType: 'explainer',
    category,
    standfirst: 'A gentle introduction to PMOS.',
    body: [],
    author: { _id: 'au1', _type: 'author', name: 'A', slug: { current: 'a' }, role: 'writer' },
    publishedAt: '2026-01-01',
  },
]

const glossaryTerms: GlossaryTermRef[] = [
  {
    _id: 'g1',
    _type: 'glossaryTerm',
    term: 'Anovulation',
    slug: { current: 'anovulation' },
    shortDefinition: 'A menstrual cycle in which an egg is not released from the ovary.',
    fullExplanation: [],
  },
]

describe('searchContent', () => {
  it('returns nothing for an empty query', () => {
    expect(searchContent('', articles, glossaryTerms)).toEqual([])
    expect(searchContent('   ', articles, glossaryTerms)).toEqual([])
  })

  it('matches an article by title', () => {
    const results = searchContent('pmos', articles, glossaryTerms)
    expect(results.some((r) => r.type === 'article' && r.href.includes('what-is-pmos'))).toBe(true)
  })

  it('matches a glossary term by its definition text', () => {
    const results = searchContent('egg is not released', articles, glossaryTerms)
    expect(results).toHaveLength(1)
    expect(results[0]).toMatchObject({ type: 'glossaryTerm', title: 'Anovulation' })
  })

  it('ranks an exact/startsWith title match above a body-only match', () => {
    const results = searchContent('anovulation', articles, glossaryTerms)
    expect(results[0].title).toBe('Anovulation')
  })

  it('is case-insensitive', () => {
    expect(searchContent('ANOVULATION', articles, glossaryTerms)).toHaveLength(1)
  })

  it('returns no results for an unmatched query', () => {
    expect(searchContent('xyznotfound', articles, glossaryTerms)).toEqual([])
  })
})
