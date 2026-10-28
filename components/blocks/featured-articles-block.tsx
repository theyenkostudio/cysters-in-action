import { ArticleCard } from '@/components/learn/article-card'
import { ButtonLink } from '@/components/ui/button'
import { Reveal, Stagger } from '@/components/motion/reveal'
import { getAllArticles, getArticlesByCategory, getFeaturedArticles } from '@/lib/sanity/content'
import { resolveHref } from '@/lib/link'
import type { ArticleRef, CategoryRef, CtaValue } from '@/lib/sanity/types'

export type FeaturedArticlesData = {
  heading?: string
  mode?: 'latest' | 'featured' | 'manual' | 'byCategory'
  manualArticles?: ArticleRef[]
  category?: CategoryRef
  limit?: number
  cta?: CtaValue
}

export async function FeaturedArticlesBlock({ data }: { data: FeaturedArticlesData }) {
  const limit = data.limit ?? 3
  let articles: ArticleRef[] = []

  switch (data.mode) {
    case 'manual':
      articles = data.manualArticles ?? []
      break
    case 'byCategory':
      articles = data.category ? await getArticlesByCategory(data.category.slug.current) : []
      break
    case 'featured':
      articles = await getFeaturedArticles()
      break
    case 'latest':
    default:
      articles = await getAllArticles()
      break
  }

  articles = articles.slice(0, limit)
  if (articles.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
      <div className="flex items-end justify-between">
        {data.heading && (
          <Reveal>
            <h2 className="font-display text-fg-heading text-3xl font-semibold">{data.heading}</h2>
          </Reveal>
        )}
        {data.cta?.link && (
          <ButtonLink
            href={resolveHref(data.cta.link)}
            variant="ghost"
            className="hidden sm:inline-flex"
          >
            {data.cta.link.label}
          </ButtonLink>
        )}
      </div>
      <Stagger className="mt-8 grid items-stretch gap-6 sm:grid-cols-3">
        {articles.map((article) => (
          <Reveal key={article._id} className="h-full">
            <ArticleCard article={article} />
          </Reveal>
        ))}
      </Stagger>
      {data.cta?.link && (
        <ButtonLink
          href={resolveHref(data.cta.link)}
          variant="ghost"
          className="mt-6 w-full sm:hidden"
        >
          {data.cta.link.label}
        </ButtonLink>
      )}
    </section>
  )
}
