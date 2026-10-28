import NextLink from 'next/link'
import { Icon } from './icon'

export type BreadcrumbItem = { label: string; href?: string }

/**
 * Chevron-separated pill trail. The last item is treated as the current
 * page — rendered as plain text, not a link, even if it has no `href`.
 */
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5">
      {items.map((item, i) => {
        const isCurrent = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <Icon name="chevron-right" className="text-fg-subtle h-3.5 w-3.5" />}
            {item.href && !isCurrent ? (
              <NextLink
                href={item.href}
                className="border-default text-fg-muted hover:border-accent-orchid hover:text-fg rounded-pill border px-3 py-1 text-[13px] font-medium transition-colors"
              >
                {item.label}
              </NextLink>
            ) : (
              <span className="text-fg-subtle px-3 py-1 text-[13px] font-medium">{item.label}</span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
