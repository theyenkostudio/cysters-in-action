'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { NewsletterForm } from '@/components/forms/newsletter-form'

export function NewsletterModalTrigger({
  label,
  className,
  size,
}: {
  label: string
  className?: string
  size?: 'md' | 'sm'
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="solid" size={size} className={className}>
          {label}
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content className="rounded-dialog bg-canvas fixed top-1/2 left-1/2 z-50 w-[min(28rem,90vw)] -translate-x-1/2 -translate-y-1/2 p-6 shadow-lg">
          <Dialog.Title className="font-display text-fg-heading text-xl font-semibold">
            Join the newsletter
          </Dialog.Title>
          <Dialog.Description className="text-fg-muted mt-1 text-sm">
            Occasional emails about new Learn hub articles, events and ways to get involved.
          </Dialog.Description>
          <div className="mt-5">
            <NewsletterForm source="nav" onSuccess={() => setTimeout(() => setOpen(false), 2500)} />
          </div>
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close"
              className="text-fg-muted hover:text-fg absolute top-4 right-4"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
