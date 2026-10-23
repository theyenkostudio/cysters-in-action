import { StoriesCarousel } from '@/components/connect/stories-carousel'
import { ButtonLink } from '@/components/ui/button'
import { Reveal } from '@/components/motion/reveal'
import { getApprovedStories, getFeaturedStories } from '@/lib/sanity/content'
import { resolveHref } from '@/lib/link'
import type { CtaValue, StoryRef } from '@/lib/sanity/types'

export type StoriesCarouselData = {
  heading?: string
  mode?: 'featured' | 'latest' | 'manual'
  manualStories?: StoryRef[]
  cta?: CtaValue
  animation?: 'none' | 'subtle' | 'exaggerated'
}

export async function StoriesCarouselBlock({ data }: { data: StoriesCarouselData }) {
  let stories: StoryRef[] = []
  switch (data.mode) {
    case 'manual':
      stories = data.manualStories ?? []
      break
    case 'latest':
      stories = await getApprovedStories()
      break
    case 'featured':
    default:
      stories = await getFeaturedStories()
      break
  }

  if (stories.length === 0) return null

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-8">
      {data.heading && (
        <Reveal>
          <h2 className="font-display text-fg-heading text-center text-3xl font-semibold">
            {data.heading}
          </h2>
        </Reveal>
      )}
      <div className="mt-8">
        <StoriesCarousel stories={stories} exaggerated={data.animation === 'exaggerated'} />
      </div>
      {data.cta?.link && (
        <div className="mt-8 text-center">
          <ButtonLink href={resolveHref(data.cta.link)} variant="solid">
            {data.cta.link.label}
          </ButtonLink>
        </div>
      )}
    </section>
  )
}
