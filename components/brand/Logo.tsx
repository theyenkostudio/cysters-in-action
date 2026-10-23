import { cn } from '@/lib/utils'

/**
 * Text wordmark standing in for the client's real logo SVG (spec.md Phase 0:
 * "client supplies the logo as SVG... before Phase 1 starts" — it hasn't yet).
 * Deliberately does not recreate the launch flyer's lettering/mark, just sets
 * the name in the theme's display font and heading colour. Swapping in the
 * real logo later means replacing this one file with an <Image>/<svg>, no
 * caller changes needed — every usage imports <Logo /> by name.
 */
export function Logo({ className, inverse = false }: { className?: string; inverse?: boolean }) {
  return (
    <span
      className={cn(
        'font-display inline-flex items-baseline gap-1.5 leading-none',
        inverse ? 'text-fg-default' : 'text-fg-heading',
        className,
      )}
    >
      <span className="text-lg font-semibold tracking-tight">Cysters</span>
      <span className="text-xs font-medium tracking-[0.2em] uppercase opacity-80">In Action</span>
    </span>
  )
}
