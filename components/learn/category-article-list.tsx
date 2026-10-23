'use client'

import { useMemo, useState } from 'react'
import { ArticleCard } from '@/components/learn/article-card'
import { ARTICLE_TYPE_LABELS } from '@/components/learn/article-type-badge'
import { cn } from '@/lib/utils'
import type { ArticleRef, ArticleType } from '@/lib/sanity/types'

export function CategoryArticleList({ articles }: { articles: ArticleRef[] }) {
  const [typeFilter, setTypeFilter] = useState<ArticleType | 'all'>('all')
  const [tagFilter, setTagFilter] = useState<string | 'all'>('all')

  const types = useMemo(() => Array.from(new Set(articles.map((a) => a.articleType))), [articles])
  const tags = useMemo(() => Array.from(new Set(articles.flatMap((a) => a.tags ?? []))), [articles])

  const filtered = articles.filter(
    (a) =>
      (typeFilter === 'all' || a.articleType === typeFilter) &&
      (tagFilter === 'all' || a.tags?.includes(tagFilter)),
  )

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <FilterPill active={typeFilter === 'all'} onClick={() => setTypeFilter('all')}>
          All types
        </FilterPill>
        {types.map((type) => (
          <FilterPill key={type} active={typeFilter === type} onClick={() => setTypeFilter(type)}>
            {ARTICLE_TYPE_LABELS[type]}
          </FilterPill>
        ))}
      </div>

      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          <FilterPill active={tagFilter === 'all'} onClick={() => setTagFilter('all')} subtle>
            All tags
          </FilterPill>
          {tags.map((tag) => (
            <FilterPill
              key={tag}
              active={tagFilter === tag}
              onClick={() => setTagFilter(tag)}
              subtle
            >
              #{tag}
            </FilterPill>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-fg-muted mt-10">No articles match these filters yet.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {filtered.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterPill({
  active,
  onClick,
  children,
  subtle,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  subtle?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-pill border px-3 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-on-primary'
          : subtle
            ? 'border-default text-fg-muted hover:bg-muted'
            : 'border-default text-fg hover:bg-muted',
      )}
    >
      {children}
    </button>
  )
}
