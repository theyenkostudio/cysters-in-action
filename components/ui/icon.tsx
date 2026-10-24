import type { SVGProps } from 'react'

const PATHS: Record<string, string> = {
  learn:
    'M4 6.5A2.5 2.5 0 0 1 6.5 4H12v16H6.5A2.5 2.5 0 0 1 4 17.5zM20 6.5A2.5 2.5 0 0 0 17.5 4H12v16h5.5a2.5 2.5 0 0 0 2.5-2.5z',
  connect:
    'M8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM16 20a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM9.5 13.5l5 3.5M20 8l-6 4',
  act: 'M13 2 4 14h6l-1 8 9-12h-6z',
  'book-open':
    'M4 6.5A2.5 2.5 0 0 1 6.5 4H12v16H6.5A2.5 2.5 0 0 1 4 17.5zM20 6.5A2.5 2.5 0 0 0 17.5 4H12v16h5.5a2.5 2.5 0 0 0 2.5-2.5z',
  lightbulb:
    'M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2zM9 21h6',
  'clipboard-list':
    'M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1zM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zM9 12h6M9 16h6',
  heart: 'M12 20s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 5c-2.5 4.6-9.5 9-9.5 9z',
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.35-4.35',
}

export function Icon({
  name,
  className,
  ...props
}: { name: string; className?: string } & SVGProps<SVGSVGElement>) {
  const d = PATHS[name]
  if (!d) return null

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...props}
    >
      <path d={d} />
    </svg>
  )
}
