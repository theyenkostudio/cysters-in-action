import type { Metadata } from 'next'
import NextLink from 'next/link'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Reveal } from '@/components/motion/reveal'
import { getAllArticles, getGlossaryTerms } from '@/lib/sanity/content'
import { searchContent } from '@/lib/search'
import { siteUrl } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Search',
  alternates: { canonical: `${siteUrl}/search` },
  robots: { index: false, follow: true },
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = '' } = await searchParams
  const [articles, glossaryTerms] = await Promise.all([getAllArticles(), getGlossaryTerms()])
  const results = searchContent(q, articles, glossaryTerms)

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
      <Reveal>
        <Eyebrow>Learn</Eyebrow>
        <h1 className="font-display text-fg-heading mt-4 text-4xl font-semibold">Search</h1>
        <p className="text-fg-muted mt-3 max-w-xl">
          Search articles and glossary terms across the Learn hub.
        </p>
      </Reveal>

      <form role="search" method="get" className="mt-8 flex gap-2">
        <label htmlFor="search-page-input" className="sr-only">
          Search Learn and Glossary
        </label>
        <input
          id="search-page-input"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Search for a topic or term…"
          className="border-default bg-canvas text-fg rounded-pill flex-1 border px-4 py-2 outline-none"
        />
        <button
          type="submit"
          className="rounded-pill bg-primary text-on-primary px-5 py-2 text-sm font-medium"
        >
          Search
        </button>
      </form>

      <div className="mt-10">
        <h2 className="sr-only">Results</h2>
        {!q.trim() ? (
          <p className="text-fg-muted">
            Enter a search term to look across articles and glossary terms.
          </p>
        ) : results.length === 0 ? (
          <p className="text-fg-muted">
            No results for &ldquo;{q}&rdquo;. Try a different word, or browse the{' '}
            <NextLink href="/learn" className="text-fg-link hover:text-fg-link-hover underline">
              Learn hub
            </NextLink>
            .
          </p>
        ) : (
          <>
            <p className="text-fg-subtle text-sm">
              {results.length} result{results.length === 1 ? '' : 's'} for &ldquo;{q}&rdquo;
            </p>
            <ul className="border-default mt-4 divide-y border-t">
              {results.map((result) => (
                <li key={result.href} className="py-5">
                  <NextLink href={result.href} className="group block">
                    <span className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
                      {result.meta}
                    </span>
                    <h3 className="font-display text-fg-heading group-hover:text-fg-link mt-1 text-lg font-semibold">
                      {result.title}
                    </h3>
                    {result.description && (
                      <p className="text-fg-muted mt-1 text-sm">{result.description}</p>
                    )}
                  </NextLink>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
