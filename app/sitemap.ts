import type { MetadataRoute } from 'next'
import {
  getAllArticles,
  getAllEventSlugs,
  getAllGlossaryTermSlugs,
  getAllPageSlugs,
  getApprovedStories,
  getCategories,
} from '@/lib/sanity/content'
import { siteUrl } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // sitemap.ts runs at build time with no HTTP request — draftMode() throws
  // if called from here at all, so every call below skips it.
  const [articles, categories, genericPages, stories, eventSlugs, glossarySlugs] =
    await Promise.all([
      getAllArticles({ skipDraftMode: true }),
      getCategories({ skipDraftMode: true }),
      getAllPageSlugs(),
      getApprovedStories({ skipDraftMode: true }),
      getAllEventSlugs(),
      getAllGlossaryTermSlugs(),
    ])

  return [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/learn`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/learn/glossary`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/connect/stories`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/connect/share-your-story`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/connect/events`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/connect/guidelines`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/contact`, changeFrequency: 'yearly', priority: 0.4 },
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
    ...glossarySlugs.map((g) => ({
      url: `${siteUrl}/learn/glossary/${g.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    })),
    ...stories
      .filter((s) => s.slug)
      .map((s) => ({
        url: `${siteUrl}/connect/stories/${s.slug!.current}`,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      })),
    ...eventSlugs.map((e) => ({
      url: `${siteUrl}/connect/events/${e.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
    ...genericPages.map((p) => ({
      url: `${siteUrl}/${p.slug}`,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
  ]
}
