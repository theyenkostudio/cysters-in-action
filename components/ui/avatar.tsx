import { cn } from '@/lib/utils'

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

const PALETTE = [
  'bg-teal-100 text-teal-800',
  'bg-orchid-100 text-orchid-700',
  'bg-lagoon-100 text-lagoon-700',
]

function paletteFor(name: string) {
  const index = name.length % PALETTE.length
  return PALETTE[index]
}

/**
 * Initials avatar used wherever we don't have a real photo (every
 * placeholder teamMember fixture). Deliberately not a stock headshot —
 * see lib/sanity/fixtures/teamMembers.ts for why.
 */
export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'font-display inline-flex items-center justify-center rounded-full text-lg font-semibold',
        paletteFor(name),
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}
