import type { Metadata } from 'next'
import { ArticleCard } from '@/components/learn/article-card'
import { CategoryCard } from '@/components/learn/category-card'
import { BlockRenderer } from '@/components/blocks/block-renderer'
import { Hero } from '@/components/blocks/hero'
import { Reveal, Stagger } from '@/components/motion/reveal'
import { getAllArticles, getCategories, getLearnHubPage } from '@/lib/sanity/content'
import { seoToMetadata } from '@/lib/seo'

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
        <Reveal className="mx-auto max-w-2xl px-4 py-12 text-center sm:px-8">
          <p className="text-fg-muted">{learnHubPage.introText}</p>
        </Reveal>
      )}

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        <Reveal>
          <h2 className="font-display text-fg-heading text-2xl font-semibold">Browse by topic</h2>
        </Reveal>
        <Stagger className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {categories.map((category) => (
            <Reveal key={category._id}>
              <CategoryCard category={category} />
            </Reveal>
          ))}
        </Stagger>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
          <Reveal>
            <h2 className="font-display text-fg-heading text-2xl font-semibold">Featured</h2>
          </Reveal>
          <Stagger className="mt-6 grid gap-6 sm:grid-cols-3">
            {featured.map((article) => (
              <Reveal key={article._id}>
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </Stagger>
        </section>
      )}

      {latest.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
          <Reveal>
            <h2 className="font-display text-fg-heading text-2xl font-semibold">Latest</h2>
          </Reveal>
          <Stagger className="mt-6 grid gap-6 sm:grid-cols-3">
            {latest.map((article) => (
              <Reveal key={article._id}>
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </Stagger>
        </section>
      )}

      <BlockRenderer sections={learnHubPage.sections} />
    </>
  )
}
