'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

/** Search icon that expands into an inline query field (nav + mobile menu),
 * submitting to the /search page (Phase 5: "Site search across Learn and
 * Glossary"). Kept as plain GET navigation rather than live results, so it
 * costs nothing in first-load JS on every other page. */
export function SearchTrigger({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  if (!open) {
    return (
      <button
        type="button"
        aria-label="Search"
        onClick={() => setOpen(true)}
        className={cn('text-fg hover:bg-muted rounded-full p-2', className)}
      >
        <Icon name="search" className="h-5 w-5" />
      </button>
    )
  }

  return (
    <form
      role="search"
      className="flex items-center gap-1"
      onSubmit={(e) => {
        e.preventDefault()
        const q = inputRef.current?.value.trim()
        setOpen(false)
        router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
      }}
    >
      <label htmlFor="nav-search-input" className="sr-only">
        Search Learn and Glossary
      </label>
      <input
        ref={inputRef}
        id="nav-search-input"
        type="search"
        placeholder="Search…"
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false)
        }}
        className="border-default bg-canvas text-fg rounded-pill w-36 border px-3 py-1.5 text-sm outline-none sm:w-48"
      />
      <button
        type="submit"
        aria-label="Submit search"
        className="text-fg hover:bg-muted rounded-full p-2"
      >
        <Icon name="search" className="h-4 w-4" />
      </button>
    </form>
  )
}
