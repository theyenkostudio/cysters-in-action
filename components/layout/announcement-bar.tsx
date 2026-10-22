'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { SmartLink } from '@/components/ui/smart-link'
import type { ResolvedLink } from '@/lib/link'
import { cn } from '@/lib/utils'

export type AnnouncementBarData = {
  label?: string
  message?: string
  link?: ResolvedLink
  dismissible?: boolean
  tone?: 'brand' | 'neutral' | 'alert'
} | null

const TONE_CLASSES: Record<string, string> = {
  brand: 'bg-primary text-on-primary',
  neutral: 'bg-muted text-fg',
  alert: 'bg-error-solid text-white',
}

export function AnnouncementBar({ data }: { data: AnnouncementBarData }) {
  const [dismissed, setDismissed] = useState(false)

  if (!data?.message || dismissed) return null

  return (
    <AnimatePresence initial={false}>
      <motion.div
        key="announcement-bar"
        initial={{ height: 'auto' }}
        exit={{ height: 0 }}
        className={cn('overflow-hidden text-sm', TONE_CLASSES[data.tone ?? 'brand'])}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2 text-center">
          {data.label && (
            <span className="rounded-[var(--radius-pill)] bg-black/10 px-2 py-0.5 text-xs font-semibold uppercase">
              {data.label}
            </span>
          )}
          {data.link ? (
            <SmartLink link={data.link} className="underline underline-offset-2">
              {data.message}
            </SmartLink>
          ) : (
            <span>{data.message}</span>
          )}
          {data.dismissible && (
            <button
              type="button"
              aria-label="Dismiss announcement"
              onClick={() => setDismissed(true)}
              className="ml-2 rounded-full p-1 hover:bg-black/10"
            >
              ×
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
