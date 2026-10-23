import { ButtonLink } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { ScrollPin } from '@/components/motion/scroll-pin'
import { Stagger, Reveal } from '@/components/motion/reveal'
import { resolveHref } from '@/lib/link'
import type { ResolvedLinkValue, SanityImage } from '@/lib/sanity/types'
import { cn } from '@/lib/utils'

export type PillarData = {
  title: string
  body?: string
  icon?: 'learn' | 'connect' | 'act'
  image?: SanityImage
  link?: ResolvedLinkValue
}

export type PillarsBlockData = {
  heading?: string
  pillars: PillarData[]
  animation?: 'none' | 'subtle' | 'exaggerated'
}

const TINTS: Record<string, string> = {
  learn: 'bg-teal-50',
  connect: 'bg-orchid-50',
  act: 'bg-lagoon-50',
}

function PillarPanel({ pillar }: { pillar: PillarData }) {
  return (
    <div
      className={cn(
        'flex h-full w-full flex-col items-center justify-center px-6 text-center',
        TINTS[pillar.icon ?? 'learn'],
      )}
    >
      {pillar.icon && <Icon name={pillar.icon} className="text-fg-heading h-10 w-10" />}
      <h3 className="font-display text-fg-heading mt-4 text-3xl font-semibold">{pillar.title}</h3>
      {pillar.body && <p className="text-fg-muted mt-3 max-w-md">{pillar.body}</p>}
      {pillar.link && (
        <ButtonLink href={resolveHref(pillar.link)} variant="outline" className="mt-5">
          {pillar.link.label}
        </ButtonLink>
      )}
    </div>
  )
}

export function PillarsBlock({ data }: { data: PillarsBlockData }) {
  if (data.animation === 'exaggerated') {
    return (
      <section className="py-12">
        {data.heading && (
          <h2 className="font-display text-fg-heading mb-8 text-center text-3xl font-semibold">
            {data.heading}
          </h2>
        )}
        <ScrollPin className="rounded-card mx-auto max-w-5xl overflow-hidden">
          {data.pillars.map((pillar, i) => (
            <PillarPanel key={i} pillar={pillar} />
          ))}
        </ScrollPin>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
      {data.heading && (
        <Reveal>
          <h2 className="font-display text-fg-heading mb-8 text-center text-3xl font-semibold">
            {data.heading}
          </h2>
        </Reveal>
      )}
      <Stagger className="grid gap-6 sm:grid-cols-3">
        {data.pillars.map((pillar, i) => (
          <Reveal key={i} className="rounded-card">
            <PillarPanel pillar={pillar} />
          </Reveal>
        ))}
      </Stagger>
    </section>
  )
}
