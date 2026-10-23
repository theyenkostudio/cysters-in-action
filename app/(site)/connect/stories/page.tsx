import type { Metadata } from 'next'
import { StoryList } from '@/components/connect/story-list'
import { ButtonLink } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Reveal } from '@/components/motion/reveal'
import { getApprovedStories } from '@/lib/sanity/content'
import { seoToMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return seoToMetadata(
    undefined,
    { title: 'Community Stories', description: 'Stories shared by people living with PMOS.' },
    '/connect/stories',
  )
}

export default async function StoriesPage() {
  const stories = await getApprovedStories()

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Connect</Eyebrow>
          <h1 className="font-display text-fg-heading mt-4 text-4xl font-semibold">
            Community stories
          </h1>
          <p className="text-fg-muted mt-3 max-w-xl">
            Shared by people living with PMOS, named or anonymous, exactly as they chose to tell it.
          </p>
        </div>
        <ButtonLink href="/connect/share-your-story" variant="solid">
          Share your story
        </ButtonLink>
      </Reveal>

      <div className="mt-10">
        <StoryList stories={stories} />
      </div>
    </div>
  )
}
