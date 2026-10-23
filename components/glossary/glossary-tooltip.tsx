'use client'

import * as Tooltip from '@radix-ui/react-tooltip'
import NextLink from 'next/link'

export function GlossaryTooltip({
  term,
  shortDefinition,
  slug,
  children,
}: {
  term: string
  shortDefinition: string
  slug: string
  children: React.ReactNode
}) {
  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <NextLink
            href={`/learn/glossary/${slug}`}
            className="decoration-fg-subtle underline decoration-dotted underline-offset-2"
          >
            {children}
          </NextLink>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={6}
            className="rounded-card bg-plum-900 z-50 max-w-xs p-3 text-sm text-white shadow-lg"
          >
            <p className="font-semibold">{term}</p>
            <p className="text-blush-200 mt-1">{shortDefinition}</p>
            <Tooltip.Arrow className="fill-plum-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
