import Image from 'next/image'
import { ButtonLink } from '@/components/ui/button'
import { Reveal } from '@/components/motion/reveal'
import { RichText } from '@/components/portable-text'
import { resolveHref } from '@/lib/link'
import type { CtaValue, RichTextValue, SanityImage } from '@/lib/sanity/types'
import { cn } from '@/lib/utils'

export type ImageTextData = {
  heading?: string
  body?: RichTextValue
  image?: SanityImage
  imagePosition?: 'left' | 'right'
  cta?: CtaValue
}

export function ImageTextBlock({ data }: { data: ImageTextData }) {
  const imageFirst = data.imagePosition !== 'right'

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-8 md:grid-cols-2 md:items-center">
      {data.image && (
        <Reveal className={cn(imageFirst ? 'md:order-1' : 'md:order-2')}>
          <div className="rounded-card relative aspect-[4/3] overflow-hidden">
            <Image
              src={data.image.url}
              alt={data.image.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      )}
      <Reveal className={cn(imageFirst ? 'md:order-2' : 'md:order-1')}>
        {data.heading && (
          <h2 className="font-display text-fg-heading text-2xl font-semibold sm:text-3xl">
            {data.heading}
          </h2>
        )}
        {data.body && <RichText value={data.body} className="mt-3" />}
        {data.cta?.link && (
          <ButtonLink
            href={resolveHref(data.cta.link)}
            variant={data.cta.style ?? 'solid'}
            className="mt-6"
          >
            {data.cta.link.label}
          </ButtonLink>
        )}
      </Reveal>
    </section>
  )
}
