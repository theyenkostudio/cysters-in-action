import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CategoryArticleList } from '@/components/learn/category-article-list'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Reveal } from '@/components/motion/reveal'
import { getArticlesByCategory, getCategories, getCategoryBySlug } from '@/lib/sanity/content'
import { seoToMetadata } from '@/lib/seo'

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((c) => ({ category: c.slug.current }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category: categorySlug } = await params
  const category = await getCategoryBySlug(categorySlug)
  if (!category) return {}
  return seoToMetadata(
    undefined,
    { title: category.title, description: category.description },
    `/learn/${categorySlug}`,
  )
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params
  const [category, articles] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getArticlesByCategory(categorySlug),
  ])

  if (!category) notFound()

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
      <Reveal>
        <Eyebrow>Learn</Eyebrow>
        <h1 className="font-display text-fg-heading mt-4 text-4xl font-semibold">
          {category.title}
        </h1>
        {category.description && (
          <p className="text-fg-muted mt-3 max-w-2xl">{category.description}</p>
        )}
      </Reveal>
      <div className="mt-10">
        <h2 className="sr-only">Articles</h2>
        <CategoryArticleList articles={articles} />
      </div>
    </div>
  )
}
