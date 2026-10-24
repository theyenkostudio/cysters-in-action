import Image from 'next/image'
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

/**
 * Photo card used by the exaggerated (scroll-pinned) layout. The backdrop
 * (image + overlay) and the text content are separate siblings, not parent
 * and child: ScrollPin reveals the backdrop gradually via a scroll-scrubbed
 * clip-path, and if the text lived inside that same clipped box, the reveal
 * boundary would cut straight through its own glyphs mid-transition —
 * showing a partial, garbled word hanging in the air over the fully-visible
 * previous panel's text underneath (the reveal only occludes the *image*
 * area it has reached, not the glyph positions, which sit at the same
 * screen coordinates on every panel). Keeping content as an unclipped
 * sibling lets ScrollPin fade it in as a fast, late, all-or-nothing step
 * instead, once the backdrop has already covered what's behind it.
 *
 * The resting `active` look (colour image, lighter purple wash) for panel 0
 * is authored directly in CSS/Tailwind here; ScrollPin drives everything
 * for the *other* panels (grayscale → colour, dark → light overlay) itself
 * via `gsap.set`/`.to()` on the `data-pin-*` nodes, in the same timeline
 * that reveals the panel — mixing a pre-authored CSS value with a GSAP
 * tween of the same property is what caused the hero headline's stuck
 * transform bug, so nothing here pre-sets filter/overlay/opacity for the
 * panels ScrollPin will animate.
 */
function PillarPanel({ pillar, active = false }: { pillar: PillarData; active?: boolean }) {
  return (
    <div data-theme="inverse" className="relative h-full w-full">
      <div data-pin-backdrop className="absolute inset-0 overflow-hidden">
        {pillar.image && (
          <Image
            data-pin-image
            src={pillar.image.url}
            alt=""
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
        )}
        <div
          data-pin-overlay
          className={cn('absolute inset-0', active ? 'bg-plum-900/45' : 'bg-plum-950/85')}
        />
      </div>
      <div data-pin-content className="relative z-10 flex h-full items-end p-8 sm:p-12">
        <div>
          {pillar.icon && <Icon name={pillar.icon} className="text-fg h-8 w-8" />}
          <h3 className="font-display text-fg-heading mt-4 text-4xl font-semibold sm:text-5xl">
            {pillar.title}
          </h3>
          {pillar.body && <p className="text-fg-muted mt-3 max-w-md">{pillar.body}</p>}
          {pillar.link && (
            <ButtonLink href={resolveHref(pillar.link)} variant="on-dark" className="mt-5">
              {pillar.link.label}
            </ButtonLink>
          )}
        </div>
      </div>
    </div>
  )
}

/** Plain, always-visible version for the grid layout (no scroll pinning). */
function PillarCard({ pillar }: { pillar: PillarData }) {
  if (!pillar.image) {
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

  return (
    <div
      data-theme="inverse"
      className="relative flex aspect-[3/4] w-full items-end overflow-hidden sm:aspect-[4/5]"
    >
      <Image src={pillar.image.url} alt="" fill sizes="33vw" className="object-cover" />
      <div className="bg-plum-900/45 absolute inset-0" />
      <div className="relative z-10 p-6">
        {pillar.icon && <Icon name={pillar.icon} className="text-fg h-7 w-7" />}
        <h3 className="font-display text-fg-heading mt-3 text-2xl font-semibold">{pillar.title}</h3>
        {pillar.body && <p className="text-fg-muted mt-2 text-sm">{pillar.body}</p>}
        {pillar.link && (
          <ButtonLink href={resolveHref(pillar.link)} variant="on-dark" className="mt-4">
            {pillar.link.label}
          </ButtonLink>
        )}
      </div>
    </div>
  )
}

export function PillarsBlock({ data }: { data: PillarsBlockData }) {
  if (data.animation === 'exaggerated') {
    return (
      <section className="px-4 py-12 sm:px-8">
        {data.heading && (
          <h2 className="font-display text-fg-heading mb-8 text-center text-3xl font-semibold">
            {data.heading}
          </h2>
        )}
        <ScrollPin className="rounded-card mx-auto max-w-5xl overflow-hidden">
          {data.pillars.map((pillar, i) => (
            <PillarPanel key={i} pillar={pillar} active={i === 0} />
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
          <Reveal key={i} className="rounded-card overflow-hidden">
            <PillarCard pillar={pillar} />
          </Reveal>
        ))}
      </Stagger>
    </section>
  )
}
