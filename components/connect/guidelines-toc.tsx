'use client'

import { motion, type Transition } from 'motion/react'
import { useEffect, useState } from 'react'
import { useReducedMotion } from '@/components/motion/use-reduced-motion'
import { cn } from '@/lib/utils'
import type { TocEntry } from '@/lib/toc'

/** The heading currently at (or just above) the top of the viewport. */
function useActiveSlug(slugs: string[]) {
  const [active, setActive] = useState(slugs[0] ?? '')

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      let current = slugs[0] ?? ''
      for (const slug of slugs) {
        const el = document.getElementById(slug)
        if (el && el.getBoundingClientRect().top <= 140) current = slug
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [slugs])

  return active
}

function goTo(e: React.MouseEvent, slug: string) {
  const el = document.getElementById(slug)
  if (!el) return
  e.preventDefault()
  history.replaceState(null, '', `#${slug}`)
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -112 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

/**
 * Sticky "On this page": a short line and a label per section. The active
 * section's line stretches out on a spring and its label nudges across.
 */
export function GuidelinesToc({ entries }: { entries: TocEntry[] }) {
  const reduced = useReducedMotion()
  const active = useActiveSlug(entries.map((e) => e.slug))

  if (entries.length === 0) return null

  const spring: Transition = reduced
    ? { duration: 0 }
    : { type: 'spring', stiffness: 380, damping: 26, mass: 0.7 }

  return (
    <nav
      aria-label="On this page"
      className="sticky top-28 hidden w-64 self-start justify-self-end lg:block"
    >
      <p className="text-fg-subtle mb-5 text-xs font-semibold tracking-[0.16em] uppercase">
        On this page
      </p>
      <ul className="space-y-3.5">
        {entries.map((e) => {
          const on = e.slug === active
          return (
            <li key={e.slug}>
              <a
                href={`#${e.slug}`}
                onClick={(ev) => goTo(ev, e.slug)}
                className={cn(
                  'flex items-center gap-3 text-sm transition-colors',
                  on ? 'text-fg-heading font-medium' : 'text-fg-subtle/70 hover:text-fg',
                )}
              >
                <motion.span
                  aria-hidden="true"
                  className="h-px shrink-0 bg-current"
                  initial={false}
                  animate={{ width: on ? 36 : 16, opacity: on ? 1 : 0.3 }}
                  transition={spring}
                />
                <motion.span initial={false} animate={{ x: on ? 2 : 0 }} transition={spring}>
                  {e.text}
                </motion.span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
