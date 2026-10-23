import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import NextLink from 'next/link'
import { ContentWarning } from '@/components/connect/content-warning'
import { StoryCard } from '@/components/connect/story-card'
import { RichText } from '@/components/portable-text'
import { ButtonLink } from '@/components/ui/button'
import { Reveal } from '@/components/motion/reveal'
import { getAllApprovedStorySlugs, getApprovedStories, getStoryBySlug } from '@/lib/sanity/content'
import { seoToMetadata } from '@/lib/seo'

export async function generateStaticParams() {
  const slugs = await getAllApprovedStorySlugs()
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const story = await getStoryBySlug(slug)
  if (!story) return {}
  return seoToMetadata(undefined, { title: story.title }, `/connect/stories/${slug}`)
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [story, allStories] = await Promise.all([getStoryBySlug(slug), getApprovedStories()])
  if (!story) notFound()

  const related = allStories
    .filter((s) => s._id !== story._id && s.themes?.some((t) => story.themes?.includes(t)))
    .slice(0, 3)

  const bodyContent = (
    <Reveal className="mx-auto max-w-2xl">
      {story.pullQuote && (
        <blockquote className="font-display text-fg-heading text-2xl font-medium">
          “{story.pullQuote}”
        </blockquote>
      )}
      <RichText value={story.body} className="mt-6" />
    </Reveal>
  )

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
      <nav aria-label="Breadcrumb" className="text-fg-muted text-sm">
        <NextLink href="/connect/stories" className="hover:text-fg-link">
          Community stories
        </NextLink>
      </nav>

      <Reveal className="mt-4">
        <h1 className="font-display text-fg-heading text-4xl font-semibold">{story.title}</h1>
        <p className="text-fg-muted mt-3 text-sm font-medium">
          {story.isAnonymous ? 'Anonymous' : story.authorName}
          {story.ageRange && ` · ${story.ageRange}`}
          {story.country && ` · ${story.country}`}
        </p>
      </Reveal>

      <div className="mt-10">
        {story.contentWarning ? (
          <ContentWarning warning={story.contentWarning}>{bodyContent}</ContentWarning>
        ) : (
          bodyContent
        )}
      </div>

      <div className="mt-12 text-center">
        <ButtonLink href="/connect/share-your-story" variant="outline">
          Share your story
        </ButtonLink>
      </div>

      {related.length > 0 && (
        <section className="border-default mt-16 border-t pt-12">
          <h2 className="font-display text-fg-heading text-2xl font-semibold">Related stories</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {related.map((s) => (
              <StoryCard key={s._id} story={s} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
