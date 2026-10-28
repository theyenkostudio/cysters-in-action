import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * The small "● Our story" / "● Our values" label repeated across the About
 * page's sections. Always left-aligned — `as` picks the tag so a section
 * that genuinely needs an <h2> (one assistive tech should land on) can have
 * one while others stay a plain <span>.
 */
export function SectionEyebrow({
  children,
  as: Component = 'span',
  className,
}: {
  children: ReactNode
  as?: ElementType
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span aria-hidden="true" className="bg-accent-orchid inline-block h-2 w-2 rounded-full" />
      <Component className="text-fg-default text-[11px] font-medium tracking-[0.12em] uppercase sm:text-[12px]">
        {children}
      </Component>
    </div>
  )
}
