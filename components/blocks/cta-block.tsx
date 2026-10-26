import Image from 'next/image'
import { ButtonLink } from '@/components/ui/button'
import { Reveal } from '@/components/motion/reveal'
import { resolveHref } from '@/lib/link'
import type { CtaValue, SanityImage } from '@/lib/sanity/types'
import { cn } from '@/lib/utils'

export type CtaBlockData = {
  heading: string
  body?: string
  image?: SanityImage
  ctas?: CtaValue[]
  background?: 'light' | 'dark' | 'brand'
}

const THEME_MAP: Record<string, string | undefined> = {
  dark: 'inverse',
  brand: 'brand',
  light: undefined,
}

export function CtaBlock({ data }: { data: CtaBlockData }) {
  return (
    <section className="bg-canvas px-4 py-16 sm:px-8">
      <div
        data-theme={THEME_MAP[data.background ?? 'dark']}
        className="bg-canvas rounded-card relative mx-auto max-w-6xl overflow-hidden py-20"
      >
        {data.image && (
          <div className="absolute inset-0">
            <Image
              src={data.image.url}
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-30"
            />
          </div>
        )}
        <Reveal className={cn('relative mx-auto max-w-2xl px-4 text-center sm:px-8')}>
          <h2 className="font-display text-fg-heading text-3xl font-semibold sm:text-4xl">
            {data.heading}
          </h2>
          {data.body && <p className="text-fg-muted mt-4">{data.body}</p>}
          {data.ctas && data.ctas.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {data.ctas.map((cta, i) => (
                <ButtonLink
                  key={i}
                  href={resolveHref(cta.link)}
                  variant={cta.style === 'outline' ? 'on-dark-outline' : 'on-dark'}
                >
                  {cta.link.label}
                </ButtonLink>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}
