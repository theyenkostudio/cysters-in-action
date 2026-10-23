import type { MetadataRoute } from 'next'
import { getAllArticles, getAllPageSlugs, getCategories } from '@/lib/sanity/content'
import { siteUrl } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories, genericPages] = await Promise.all([
    getAllArticles(),
    getCategories(),
    getAllPageSlugs(),
  ])

  return [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/learn`, changeFrequency: 'weekly', priority: 0.9 },
    ...categories.map((c) => ({
      url: `${siteUrl}/learn/${c.slug.current}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...articles.map((a) => ({
      url: `${siteUrl}/learn/${a.category.slug.current}/${a.slug.current}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      lastModified: a.publishedAt,
    })),
    ...genericPages.map((p) => ({
      url: `${siteUrl}/${p.slug}`,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
  ]
}
