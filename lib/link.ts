export type ResolvedLink =
  | {
      label: string
      type: 'internal' | 'external' | 'email' | 'phone' | 'anchor'
      external?: string
      openInNewTab?: boolean
      internal?: { _type: string; slug?: { current: string } } | null
    }
  | null
  | undefined

// Maps a document type to its route prefix. Extended as each document type ships.
const ROUTE_PREFIX: Record<string, string> = {
  page: '',
}

export function resolveHref(link: ResolvedLink): string {
  if (!link) return '#'

  switch (link.type) {
    case 'internal': {
      const slug = link.internal?.slug?.current
      if (!slug) return '#'
      const prefix = ROUTE_PREFIX[link.internal?._type ?? 'page'] ?? ''
      return `${prefix}/${slug}`.replace(/\/+/g, '/')
    }
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
