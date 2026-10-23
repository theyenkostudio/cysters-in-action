import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import NextLink from 'next/link'
import { ArticleCard } from '@/components/learn/article-card'
import { ArticleToc } from '@/components/learn/article-toc'
import { ARTICLE_TYPE_LABELS } from '@/components/learn/article-type-badge'
import { DoctorQuestionsChecklist } from '@/components/learn/doctor-questions-checklist'
import { MythFactList } from '@/components/learn/myth-fact-list'
import { RichText } from '@/components/portable-text'
import { Badge } from '@/components/ui/badge'
import { Reveal } from '@/components/motion/reveal'
import { getAllArticles, getArticleBySlug } from '@/lib/sanity/content'
import { estimateReadingTime } from '@/lib/reading-time'
import { articleJsonLd, breadcrumbJsonLd, JsonLd, seoToMetadata } from '@/lib/seo'
import { extractHeadings } from '@/lib/toc'

function isReviewDue(lastReviewedAt?: string) {
  if (!lastReviewedAt) return false
  const twelveMonthsMs = 365 * 24 * 60 * 60 * 1000
  return Date.now() - new Date(lastReviewedAt).getTime() > twelveMonthsMs
}

export async function generateStaticParams() {
  const articles = await getAllArticles()
  return articles.map((a) => ({ category: a.category.slug.current, slug: a.slug.current }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}): Promise<Metadata> {
  const { category, slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}
  return seoToMetadata(
    article.seo,
    { title: article.title, description: article.standfirst },
    `/learn/${category}/${slug}`,
  )
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { category: categorySlug, slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article || article.category.slug.current !== categorySlug) notFound()

  const readingTime = estimateReadingTime(article.body)
  const toc = extractHeadings(article.body)
  const path = `/learn/${categorySlug}/${slug}`

  return (
    <article className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
      <JsonLd data={articleJsonLd(article, path)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Learn', path: '/learn' },
          { name: article.category.title, path: `/learn/${categorySlug}` },
          { name: article.title, path },
        ])}
      />

      <nav aria-label="Breadcrumb" className="text-fg-muted text-sm">
        <NextLink href="/learn" className="hover:text-fg-link">
          Learn
        </NextLink>{' '}
        /{' '}
        <NextLink href={`/learn/${categorySlug}`} className="hover:text-fg-link">
          {article.category.title}
        </NextLink>
      </nav>

      <Reveal className="mt-4 max-w-3xl">
        <div className="flex items-center gap-2">
          <Badge>{ARTICLE_TYPE_LABELS[article.articleType]}</Badge>
          {isReviewDue(article.lastReviewedAt) && <Badge tone="warning">Review due</Badge>}
        </div>
        <h1 className="font-display text-fg-heading mt-4 text-4xl font-semibold sm:text-5xl">
          {article.title}
        </h1>
        {article.standfirst && <p className="text-fg-muted mt-4 text-lg">{article.standfirst}</p>}

        <div className="text-fg-subtle mt-6 flex flex-wrap items-center gap-4 text-sm">
          <span>By {article.author.name}</span>
          {article.medicalReviewer && <span>Reviewed by {article.medicalReviewer.name}</span>}
          {article.lastReviewedAt && (
            <span>
              Last reviewed{' '}
              {new Date(article.lastReviewedAt).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}
          <span>{readingTime} min read</span>
        </div>

        {article.contentWarning && (
          <p className="rounded-card bg-warning-bg text-warning-text mt-4 p-3 text-sm">
            Content warning: {article.contentWarning}
          </p>
        )}
      </Reveal>

      {article.mainImage && (
        <Reveal className="mt-8">
          <div className="rounded-card relative aspect-video overflow-hidden">
            <Image
              src={article.mainImage.url}
              alt={article.mainImage.alt}
              fill
              priority
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
            />
          </div>
          {article.mainImage.credit && (
            <p className="text-fg-subtle mt-2 text-xs">{article.mainImage.credit}</p>
          )}
        </Reveal>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_220px]">
        <div className="max-w-3xl">
          <RichText value={article.body} />

          {article.articleType === 'mythBuster' && article.myths && article.myths.length > 0 && (
            <MythFactList myths={article.myths} />
          )}

          {article.articleType === 'doctorGuide' &&
            article.doctorQuestions &&
            article.doctorQuestions.length > 0 && (
              <DoctorQuestionsChecklist title={article.title} questions={article.doctorQuestions} />
            )}

          {article.sources && article.sources.length > 0 && (
            <div className="border-default mt-10 border-t pt-6">
              <p className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
                Sources
              </p>
              <ul className="text-fg-muted mt-2 space-y-1 text-sm">
                {article.sources.map((source, i) => (
                  <li key={i}>
                    {source.url ? (
                      <a href={source.url} className="text-fg-link underline">
                        {source.title}
                      </a>
                    ) : (
                      source.title
                    )}
                    {source.publisher && ` — ${source.publisher}`}
                    {source.year && ` (${source.year})`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="border-default text-fg-subtle mt-10 border-t pt-6 text-sm">
            This article is for general information only and is not medical advice. Always speak
            with a qualified healthcare provider about your own diagnosis and treatment.
          </p>
        </div>

        <ArticleToc entries={toc} />
      </div>

      {article.relatedArticles && article.relatedArticles.length > 0 && (
        <section className="border-default mt-16 border-t pt-12">
          <Reveal>
            <h2 className="font-display text-fg-heading text-2xl font-semibold">
              Related articles
            </h2>
          </Reveal>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {article.relatedArticles.map((related) => (
              <ArticleCard key={related._id} article={related} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
