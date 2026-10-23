export type ResolvedLink =
  | {
      label: string
      type: 'internal' | 'external' | 'email' | 'phone' | 'anchor'
      external?: string
      openInNewTab?: boolean
      internal?: {
        _type: string
        slug?: { current: string }
        category?: { slug?: { current: string } } | null
      } | null
    }
  | null
  | undefined

export function internalHref(doc: {
  _type: string
  slug?: { current: string } | string
  category?: { slug?: { current: string } | string } | null
}): string {
  const slug = typeof doc.slug === 'string' ? doc.slug : doc.slug?.current
  if (!slug) return '#'

  switch (doc._type) {
    case 'article': {
      const categorySlug =
        typeof doc.category?.slug === 'string' ? doc.category?.slug : doc.category?.slug?.current
      return `/learn/${categorySlug ?? ''}/${slug}`.replace(/\/+/g, '/')
    }
    case 'category':
      return `/learn/${slug}`
    case 'page':
    default:
      return `/${slug}`
  }
}

export function resolveHref(link: ResolvedLink): string {
  if (!link) return '#'

  switch (link.type) {
    case 'internal':
      return link.internal ? internalHref(link.internal) : '#'
    case 'email':
      return `mailto:${link.external ?? ''}`
    case 'phone':
      return `tel:${link.external ?? ''}`
    case 'anchor':
      return link.external?.startsWith('#') ? link.external : `#${link.external ?? ''}`
    case 'external':
    default:
      return link.external ?? '#'
  }
}
