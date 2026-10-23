import Image from 'next/image'
import { Reveal } from '@/components/motion/reveal'
import type { HeroMediaValue } from '@/lib/sanity/types'
import { cn } from '@/lib/utils'

export function MediaBlock({
  data,
}: {
  data: { heroMedia?: HeroMediaValue; caption?: string; fullBleed?: boolean }
}) {
  if (!data.heroMedia) return null

  return (
    <section className={cn('py-12', !data.fullBleed && 'mx-auto max-w-4xl px-4 sm:px-8')}>
      <Reveal>
        <figure
          className={cn('relative aspect-video overflow-hidden', !data.fullBleed && 'rounded-card')}
        >
          {data.heroMedia.mediaType === 'video' && data.heroMedia.videoUrl ? (
            <video
              src={data.heroMedia.videoUrl}
              poster={data.heroMedia.poster?.url}
              controls
              className="h-full w-full object-cover"
            />
          ) : data.heroMedia.image ? (
            <Image
              src={data.heroMedia.image.url}
              alt={data.heroMedia.image.alt}
              fill
              sizes="100vw"
              className="object-cover"
            />
          ) : null}
          {data.caption && (
            <figcaption className="text-fg-subtle mt-2 text-sm">{data.caption}</figcaption>
          )}
        </figure>
      </Reveal>
    </section>
  )
}
