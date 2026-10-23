import type { Metadata } from 'next'
import type { SeoValue } from './sanity/types'

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export function seoToMetadata(
  seo: SeoValue | undefined | null,
  fallback: { title: string; description?: string },
  path = '',
): Metadata {
  const title = seo?.metaTitle || fallback.title
  const description = seo?.metaDescription || fallback.description
  const canonical = seo?.canonicalUrl || `${siteUrl}${path}`

  return {
    title,
    description,
    alternates: { canonical },
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url: canonical,
      images: seo?.ogImage ? [{ url: seo.ogImage.url }] : undefined,
    },
  }
}

export function organizationJsonLd(siteName: string, logoUrl?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: logoUrl,
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  }
}

export function articleJsonLd(
  article: {
    title: string
    standfirst?: string
    publishedAt: string
    lastReviewedAt?: string
    author: { name: string }
    medicalReviewer?: { name: string }
    mainImage?: { url: string }
  },
  path: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.standfirst,
    datePublished: article.publishedAt,
    dateModified: article.lastReviewedAt ?? article.publishedAt,
    author: { '@type': 'Person', name: article.author.name },
    ...(article.medicalReviewer
      ? { reviewedBy: { '@type': 'Person', name: article.medicalReviewer.name } }
      : {}),
    image: article.mainImage?.url,
    mainEntityOfPage: `${siteUrl}${path}`,
  }
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}
