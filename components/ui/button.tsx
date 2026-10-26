import { cva, type VariantProps } from 'class-variance-authority'
import NextLink from 'next/link'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

// Every variant shares one hover: a fill wipes up from the bottom edge
// (the ::before layer scaling on Y, origin bottom) while the label colour
// flips. Each variant only picks its resting look, the fill colour
// (`before:bg-*`) and the label colour once filled (`hover:text-*`).
const buttonStyles = cva(
  [
    'rounded-pill relative inline-flex items-center justify-center gap-2 overflow-hidden px-5 py-2.5 text-sm font-medium',
    'transition-colors duration-250 focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:outline-none',
    'before:absolute before:inset-0 before:origin-bottom before:scale-y-0 before:transition-transform before:duration-250 before:content-[""]',
    'hover:before:scale-y-100 focus-visible:before:scale-y-100 motion-reduce:transition-none motion-reduce:before:transition-none',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        solid: 'bg-primary text-on-primary before:bg-primary-hover',
        outline:
          'border border-input text-fg bg-transparent before:bg-primary hover:text-on-primary focus-visible:text-on-primary',
        ghost: 'bg-transparent text-fg before:bg-muted',
        'on-dark':
          'bg-on-primary text-primary before:bg-primary hover:text-on-primary focus-visible:text-on-primary',
        // White pill for sitting on photos/gradients; wipes to dark plum.
        'on-photo':
          'bg-white text-[var(--plum-950)] before:bg-[var(--plum-950)] hover:text-white focus-visible:text-white',
        // Outline for dark/inverse surfaces.
        'on-dark-outline':
          'border border-current text-fg bg-transparent before:bg-fg hover:text-[var(--plum-950)] focus-visible:text-[var(--plum-950)]',
      },
      size: {
        md: '',
        sm: 'h-9 px-[18px] py-0 text-[13px]',
      },
    },
    defaultVariants: { variant: 'solid', size: 'md' },
  },
)

type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonStyles>

export function Button({ className, variant, size, children, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonStyles({ variant, size }), className)} {...props}>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  )
}

type ButtonLinkProps = ComponentProps<typeof NextLink> & VariantProps<typeof buttonStyles>

export function ButtonLink({ className, variant, size, children, ...props }: ButtonLinkProps) {
  return (
    <NextLink className={cn(buttonStyles({ variant, size }), className)} {...props}>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </NextLink>
  )
}
