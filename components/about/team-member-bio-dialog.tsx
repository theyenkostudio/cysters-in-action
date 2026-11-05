'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { useLenisScrollLock } from '@/components/motion/use-lenis-scroll-lock'
import { countryFlagEmoji } from '@/lib/countries'
import type { TeamMemberRef } from '@/lib/sanity/types'

/**
 * A founding member's full bio, which can run long — this is the "Read
 * more" from their card. Same responsive treatment as the event RSVP
 * quick-view: a bottom sheet below `sm`, a centered dialog (with a gentle
 * fade/scale) at `sm` and up, both scrollable if the bio doesn't fit.
 */
export function TeamMemberBioDialog({ member }: { member: TeamMemberRef }) {
  const [open, setOpen] = useState(false)
  useLenisScrollLock(open)

  if (!member.bio) return null
  const flag = member.country && countryFlagEmoji(member.country)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="text-fg-link mt-3 text-sm font-medium underline-offset-2 hover:underline"
        >
          Read more
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-dialog-overlay fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content className="sheet-dialog-panel bg-canvas rounded-t-dialog sm:rounded-dialog fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] w-full flex-col pb-[env(safe-area-inset-bottom)] shadow-lg sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-[min(32rem,94vw)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:pb-0">
          <div
            data-lenis-prevent
            className="scrollbar-hide min-h-0 flex-1 overflow-y-auto p-6 sm:p-8"
          >
            <Dialog.Title className="font-display text-fg-heading pr-8 text-2xl font-semibold">
              {member.name}
            </Dialog.Title>
            <Dialog.Description className="text-fg-muted mt-1 text-sm">
              {member.role}
              {member.country && (
                <>
                  {' · '}
                  {flag && <span aria-hidden="true">{flag} </span>}
                  {member.country}
                </>
              )}
            </Dialog.Description>
            <p className="text-fg mt-5 text-sm leading-relaxed whitespace-pre-line">{member.bio}</p>
            {member.quote && <p className="text-fg-subtle mt-5 text-sm italic">“{member.quote}”</p>}
          </div>
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close"
              className="text-fg-muted hover:text-fg bg-canvas absolute top-4 right-4 rounded-full p-1"
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
