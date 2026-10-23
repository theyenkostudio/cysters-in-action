import type { TocEntry } from '@/lib/toc'

export function ArticleToc({ entries }: { entries: TocEntry[] }) {
  if (entries.length === 0) return null

  return (
    <nav aria-label="On this page" className="sticky top-24 hidden lg:block">
      <p className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">On this page</p>
      <ul className="border-default mt-3 space-y-2 border-l pl-4">
        {entries.map((entry) => (
          <li key={entry.slug} className={entry.level === 3 ? 'ml-3' : undefined}>
            <a href={`#${entry.slug}`} className="text-fg-muted hover:text-fg-link text-sm">
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
