import { cn } from '@/lib/utils'

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'rounded-pill bg-highlight text-fg-heading inline-block px-3 py-1 text-xs font-semibold tracking-wide uppercase',
        className,
      )}
    >
      {children}
    </span>
  )
}
