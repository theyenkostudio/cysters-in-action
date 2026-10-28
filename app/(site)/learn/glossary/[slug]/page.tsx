import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import NextLink from 'next/link'
import { ArticleCard } from '@/components/learn/article-card'
import { RichText } from '@/components/portable-text'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Reveal } from '@/components/motion/reveal'
import { getAllGlossaryTermSlugs, getGlossaryTermBySlug } from '@/lib/sanity/content'
import { JsonLd, seoToMetadata, siteUrl } from '@/lib/seo'

export async function generateStaticParams() {
  const slugs = await getAllGlossaryTermSlugs()
  return slugs.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const term = await getGlossaryTermBySlug(slug)
  if (!term) return {}
  return seoToMetadata(
    undefined,
    { title: term.term, description: term.shortDefinition },
    `/learn/glossary/${slug}`,
  )
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const term = await getGlossaryTermBySlug(slug)
  if (!term) notFound()

  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-8">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'DefinedTerm',
          name: term.term,
          description: term.shortDefinition,
          url: `${siteUrl}/learn/glossary/${slug}`,
          inDefinedTermSet: `${siteUrl}/learn/glossary`,
        }}
      />

      <Breadcrumb items={[{ label: 'Glossary', href: '/learn/glossary' }, { label: term.term }]} />

      <Reveal className="mt-4">
        <h1 className="font-display text-fg-heading text-4xl font-semibold">{term.term}</h1>
        {term.pronunciation && <p className="text-fg-subtle mt-1">/{term.pronunciation}/</p>}
        {term.alsoKnownAs && term.alsoKnownAs.length > 0 && (
          <p className="text-fg-muted mt-2 text-sm">Also known as: {term.alsoKnownAs.join(', ')}</p>
        )}
        <RichText value={term.fullExplanation} className="mt-6" />
      </Reveal>

      {term.relatedTerms && term.relatedTerms.length > 0 && (
        <div className="border-default mt-10 border-t pt-6">
          <h2 className="text-fg-subtle text-sm font-semibold tracking-wide uppercase">
            Related terms
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {term.relatedTerms.map((t) => (
              <NextLink
                key={t._id}
                href={`/learn/glossary/${t.slug.current}`}
                className="rounded-pill border-default text-fg hover:bg-muted border px-3 py-1.5 text-sm"
              >
                {t.term}
              </NextLink>
            ))}
          </div>
        </div>
      )}

      {term.relatedArticles && term.relatedArticles.length > 0 && (
        <div className="border-default mt-10 border-t pt-6">
          <h2 className="text-fg-subtle text-sm font-semibold tracking-wide uppercase">
            Related articles
          </h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {term.relatedArticles.map((a) => (
              <ArticleCard key={a._id} article={a} />
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
