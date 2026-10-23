import Image from 'next/image'
import { Reveal } from '@/components/motion/reveal'
import type { SanityImage } from '@/lib/sanity/types'

export type LogoCloudData = {
  heading?: string
  logos?: { image: SanityImage; alt: string; url?: string }[]
}

export function LogoCloudBlock({ data }: { data: LogoCloudData }) {
  if (!data.logos || data.logos.length === 0) return null

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-8">
      {data.heading && (
        <Reveal>
          <h2 className="text-fg-subtle text-sm font-semibold tracking-wide uppercase">
            {data.heading}
          </h2>
        </Reveal>
      )}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-10 opacity-80">
        {data.logos.map((logo, i) => (
          <div key={i} className="relative h-10 w-28">
            <Image
              src={logo.image.url}
              alt={logo.alt}
              fill
              sizes="112px"
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
