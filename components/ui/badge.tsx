import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeStyles = cva('inline-flex items-center rounded-pill px-2.5 py-0.5 text-xs font-medium', {
  variants: {
    tone: {
      neutral: 'bg-muted text-fg-muted',
      success: 'bg-success-bg text-success-text',
      warning: 'bg-warning-bg text-warning-text',
      error: 'bg-error-bg text-error-text',
      info: 'bg-info-bg text-info-text',
    },
  },
  defaultVariants: { tone: 'neutral' },
})

export function Badge({
  className,
  tone,
  children,
}: { className?: string; children: React.ReactNode } & VariantProps<typeof badgeStyles>) {
  return <span className={cn(badgeStyles({ tone }), className)}>{children}</span>
}
