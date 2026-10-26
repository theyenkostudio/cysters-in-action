import { StoryPostcards } from '@/components/blocks/stories/StoryPostcards'
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
    <StoryPostcards
      stories={stories}
      label={data.heading}
      animated={data.animation !== 'none'}
      cta={
        data.cta?.link
          ? { label: data.cta.link.label, href: resolveHref(data.cta.link) }
          : undefined
      }
    />
  )
}
