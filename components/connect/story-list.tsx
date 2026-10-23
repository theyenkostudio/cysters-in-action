'use client'

import { useMemo, useState } from 'react'
import { StoryCard } from './story-card'
import { cn } from '@/lib/utils'
import type { StoryRef, StoryTheme } from '@/lib/sanity/types'

export function StoryList({ stories }: { stories: StoryRef[] }) {
  const [themeFilter, setThemeFilter] = useState<StoryTheme | 'all'>('all')
  const themes = useMemo(
    () => Array.from(new Set(stories.flatMap((s) => s.themes ?? []))) as StoryTheme[],
    [stories],
  )
  const filtered =
    themeFilter === 'all' ? stories : stories.filter((s) => s.themes?.includes(themeFilter))

  return (
    <div>
      {themes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <FilterPill active={themeFilter === 'all'} onClick={() => setThemeFilter('all')}>
            All themes
          </FilterPill>
          {themes.map((theme) => (
            <FilterPill
              key={theme}
              active={themeFilter === theme}
              onClick={() => setThemeFilter(theme)}
            >
              #{theme}
            </FilterPill>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-fg-muted mt-10">No stories match this theme yet.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {filtered.map((story) => (
            <StoryCard key={story._id} story={story} />
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
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
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
          : 'border-default text-fg hover:bg-muted',
      )}
    >
      {children}
    </button>
  )
}
