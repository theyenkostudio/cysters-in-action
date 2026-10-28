import NextLink from 'next/link'
import { Icon } from '@/components/ui/icon'
import type { CategoryRef } from '@/lib/sanity/types'
import { cn } from '@/lib/utils'

// Solid fills, not the usual bordered Card — this is a topic *picker*, not
// an article preview, so it should read as a different kind of object.
const TILE_TONE: Record<string, { bg: string; title: string; body: string }> = {
  teal: { bg: 'bg-teal-700', title: 'text-white', body: 'text-teal-100' },
  orchid: { bg: 'bg-orchid-700', title: 'text-white', body: 'text-orchid-100' },
  lagoon: { bg: 'bg-lagoon-700', title: 'text-white', body: 'text-lagoon-100' },
}

export function TopicTile({ category }: { category: CategoryRef }) {
  const tone = TILE_TONE[category.colour ?? 'teal'] ?? TILE_TONE.teal

  return (
    <NextLink
      href={`/learn/${category.slug.current}`}
      className={cn('rounded-card flex min-h-[168px] flex-col justify-between p-6', tone.bg)}
    >
      {category.icon && <Icon name={category.icon} className={cn('h-8 w-8', tone.title)} />}
      <div className="mt-4">
        <h3 className={cn('font-display text-lg', tone.title)}>{category.title}</h3>
        {category.description && (
          <p className={cn('mt-1.5 text-xs', tone.body)}>{category.description}</p>
        )}
      </div>
    </NextLink>
  )
}
