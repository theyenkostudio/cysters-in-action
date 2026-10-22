import { cva, type VariantProps } from 'class-variance-authority'
import NextLink from 'next/link'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const buttonStyles = cva(
  'inline-flex items-center justify-center gap-2 rounded-pill px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        solid: 'bg-primary text-on-primary hover:bg-primary-hover',
        outline: 'border border-secondary text-secondary bg-transparent hover:bg-muted',
        ghost: 'bg-transparent text-fg hover:bg-muted',
        'on-dark': 'bg-on-primary text-primary hover:opacity-90',
      },
    },
    defaultVariants: { variant: 'solid' },
  },
)

type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonStyles>

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonStyles({ variant }), className)} {...props} />
}

type ButtonLinkProps = ComponentProps<typeof NextLink> & VariantProps<typeof buttonStyles>

export function ButtonLink({ className, variant, ...props }: ButtonLinkProps) {
  return <NextLink className={cn(buttonStyles({ variant }), className)} {...props} />
}
