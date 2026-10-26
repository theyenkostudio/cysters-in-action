import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * The client's wordmark (public/brand/cysters-in-action-logo.png: trimmed,
 * transparent cut-out of the supplied "Logo full" artwork). Every usage
 * imports <Logo /> by name, so swapping in an SVG later is a one-file change.
 * `inverse` renders it solid white for dark backgrounds.
 */
export function Logo({ className, inverse = false }: { className?: string; inverse?: boolean }) {
  return (
    <Image
      src="/brand/cysters-in-action-logo.png"
      alt="Cysters In Action"
      width={1855}
      height={721}
      priority
      className={cn('h-11 w-auto', inverse && 'brightness-0 invert', className)}
    />
  )
}
