'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { CountUp } from '@/components/motion/count-up'
import { useReducedMotion } from '@/components/motion/use-reduced-motion'
import type { StatValue } from '@/lib/sanity/types'
import { cn } from '@/lib/utils'

export type StatsBlockData = {
  heading?: string
  stats: StatValue[]
  background?: 'brand' | 'dark' | 'light'
  animation?: 'none' | 'subtle' | 'exaggerated'
}

const THEME_MAP: Record<string, string | undefined> = {
  brand: 'brand',
  dark: 'inverse',
  light: undefined,
}

function DrawnArc() {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reducedMotion = useReducedMotion()

  return (
    <svg ref={ref} viewBox="0 0 100 10" className="mx-auto mt-6 w-32" aria-hidden>
      <motion.path
        d="M2 8 Q50 -2 98 8"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        className="text-accent-lagoon"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : { pathLength: reducedMotion ? 1 : 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  )
}

export function StatsBlock({ data }: { data: StatsBlockData }) {
  const exaggerated = data.animation === 'exaggerated'

  return (
    <section
      data-theme={THEME_MAP[data.background ?? 'brand']}
      className={cn('bg-canvas px-4 py-16 sm:px-8')}
    >
      <div className="mx-auto max-w-5xl text-center">
        {data.heading && (
          <h2 className="font-display text-fg-heading text-3xl font-semibold">{data.heading}</h2>
        )}
        <div
          className={cn(
            'mt-10 grid gap-10',
            data.stats.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3',
          )}
        >
          {data.stats.map((stat, i) => (
            <div key={i}>
              {exaggerated ? (
                <p className="font-display text-fg-heading text-5xl font-semibold">
                  <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </p>
              ) : (
                <p className="font-display text-fg-heading text-5xl font-semibold">
                  {stat.prefix}
                  {stat.value}
                  {stat.suffix}
                </p>
              )}
              <p className="text-fg-muted mt-2">{stat.label}</p>
              {exaggerated && i === 0 && <DrawnArc />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
