import Image from 'next/image'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Reveal } from '@/components/motion/reveal'
import type { SanityImage } from '@/lib/sanity/types'

export type ProblemSolutionData = {
  problemEyebrow?: string
  problemHeading: string
  problemBody?: string
  solutionEyebrow?: string
  solutionHeading: string
  solutionBody?: string
  image?: SanityImage
}

export function ProblemSolutionBlock({ data }: { data: ProblemSolutionData }) {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-8 md:grid-cols-2 md:items-center">
      <Reveal className="order-2 md:order-1">
        <div className="space-y-8">
          <div>
            <Eyebrow>{data.problemEyebrow ?? 'The problem'}</Eyebrow>
            <h2 className="font-display text-fg-heading mt-3 text-2xl font-semibold sm:text-3xl">
              {data.problemHeading}
            </h2>
            {data.problemBody && <p className="text-fg-muted mt-3">{data.problemBody}</p>}
          </div>
          <div>
            <Eyebrow>{data.solutionEyebrow ?? 'What we’re doing about it'}</Eyebrow>
            <h2 className="font-display text-fg-heading mt-3 text-2xl font-semibold sm:text-3xl">
              {data.solutionHeading}
            </h2>
            {data.solutionBody && <p className="text-fg-muted mt-3">{data.solutionBody}</p>}
          </div>
        </div>
      </Reveal>
      {data.image && (
        <Reveal className="order-1 md:order-2">
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
    </section>
  )
}
