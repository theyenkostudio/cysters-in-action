import type { Metadata } from 'next'
import NextLink from 'next/link'
import { BlockRenderer } from '@/components/blocks/block-renderer'
import { Hero } from '@/components/blocks/hero'
import { ARTICLE_TYPE_LABELS } from '@/components/learn/article-type-badge'
import { FeaturedSpread } from '@/components/learn/featured-spread'
import { TopicTile } from '@/components/learn/topic-tile'
import { Reveal, Stagger } from '@/components/motion/reveal'
import { internalHref } from '@/lib/link'
import { getAllArticles, getCategories, getLearnHubPage } from '@/lib/sanity/content'
import { seoToMetadata } from '@/lib/seo'

function formatArticleDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export async function generateMetadata(): Promise<Metadata> {
  const learnHubPage = await getLearnHubPage()
  return seoToMetadata(learnHubPage?.seo, { title: 'Learn' }, '/learn')
}

export default async function LearnHubPage() {
  const [learnHubPage, categories, allArticles] = await Promise.all([
    getLearnHubPage(),
    getCategories(),
    getAllArticles(),
  ])
  if (!learnHubPage) return null

  const featured =
    learnHubPage.featuredArticles.length > 0
      ? learnHubPage.featuredArticles
      : allArticles.slice(0, 3)
  const featuredIds = new Set(featured.map((a) => a._id))
  const latest = allArticles.filter((a) => !featuredIds.has(a._id))

  return (
    <>
      <Hero data={learnHubPage.hero} animation="subtle" />

      {learnHubPage.introText && (
        <Reveal className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
          <p className="text-fg-muted max-w-2xl">{learnHubPage.introText}</p>
        </Reveal>
      )}

      {/* Browse by topic: solid-colour tiles, not article cards — this is a
          picker, and reading as one kind of object distinguishes it from
          the two article sections below. */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        <Reveal>
          <h2 className="font-display text-fg-heading text-2xl font-semibold">Browse by topic</h2>
        </Reveal>
        <Stagger className="mt-6 grid gap-3.5 sm:grid-cols-2 md:grid-cols-4">
          {categories.map((category) => (
            <Reveal key={category._id}>
              <TopicTile category={category} />
            </Reveal>
          ))}
        </Stagger>
      </section>

      {/* Featured: one lead story carries the section, with two smaller
          ones running alongside it — an editorial spread instead of a
          third uniform card grid. */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
          <Reveal>
            <h2 className="font-display text-fg-heading text-2xl font-semibold">Featured</h2>
          </Reveal>
          <Reveal>
            <FeaturedSpread articles={featured} />
          </Reveal>
        </section>
      )}

      {/* Latest: a plain hairline-divided reading list — same rhythm as the
          About page's "Our values" list — so it reads as the full list,
          not another highlight tray. */}
      {latest.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
          <Reveal>
            <h2 className="font-display text-fg-heading text-2xl font-semibold">Latest</h2>
          </Reveal>
          <Stagger className="mt-2">
            {latest.map((article, i) => {
              const href = internalHref({
                _type: 'article',
                slug: article.slug,
                category: article.category,
              })
              return (
                <Reveal
                  key={article._id}
                  className={
                    i === latest.length - 1
                      ? 'border-default border-t border-b'
                      : 'border-default border-t'
                  }
                >
                  <NextLink
                    href={href}
                    className="group grid grid-cols-1 items-baseline gap-2 py-6 sm:grid-cols-[120px_1fr] sm:gap-6"
                  >
                    <span className="text-fg-subtle order-2 text-xs tabular-nums sm:order-1 sm:text-sm">
                      {formatArticleDate(article.publishedAt)}
                    </span>
                    <div className="order-1 sm:order-2">
                      <span className="text-orchid-text text-[11px] font-semibold tracking-[0.08em] uppercase">
                        {ARTICLE_TYPE_LABELS[article.articleType]}
                      </span>
                      <h3 className="text-fg-heading font-display mt-1 text-xl font-normal group-hover:underline">
                        {article.title}
                      </h3>
                      {article.standfirst && (
                        <p className="text-fg-muted mt-1 max-w-[60ch] text-sm">
                          {article.standfirst}
                        </p>
                      )}
                    </div>
                  </NextLink>
                </Reveal>
              )
            })}
          </Stagger>
        </section>
      )}

      <BlockRenderer sections={learnHubPage.sections} />
    </>
  )
}
