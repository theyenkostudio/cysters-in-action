import type { ResolvedLinkValue } from '../types'
import { getCategoryBySlug } from './categories'
import { getPageBySlug } from './pages'

/** Builds a resolved internal-link value pointing at a fixture `page` by slug. */
export function pageLink(label: string, slug: string): ResolvedLinkValue {
  const page = getPageBySlug(slug)
  return {
    label,
    type: 'internal',
    internal: page ? { _type: 'page', slug: page.slug } : null,
  }
}

/** Builds a resolved internal-link value pointing at a fixture `category` by slug. */
export function categoryLink(label: string, slug: string): ResolvedLinkValue {
  const category = getCategoryBySlug(slug)
  return {
    label,
    type: 'internal',
    internal: category ? { _type: 'category', slug: category.slug } : null,
  }
}

/** A link whose target isn't a Sanity document (e.g. /learn, /about, /). */
export function routeLink(label: string, href: string): ResolvedLinkValue {
  return { label, type: 'external', external: href }
}
