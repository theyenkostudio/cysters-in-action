import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const fieldStyles =
  'w-full rounded-input border border-input bg-canvas px-3.5 py-2.5 text-sm text-fg placeholder:text-fg-subtle focus-visible:outline-none disabled:opacity-50'

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(fieldStyles, className)} {...props} />
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={cn(fieldStyles, className)} {...props} />
}

export function Select({ className, children, ...props }: ComponentProps<'select'>) {
  return (
    <select className={cn(fieldStyles, className)} {...props}>
      {children}
    </select>
  )
}

export function Label({ className, ...props }: ComponentProps<'label'>) {
  return <label className={cn('text-fg mb-1.5 block text-sm font-medium', className)} {...props} />
}
