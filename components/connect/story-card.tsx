import NextLink from 'next/link'
import { Card, CardImage } from '@/components/ui/card'
import type { StoryRef } from '@/lib/sanity/types'

export function StoryCard({ story }: { story: StoryRef }) {
  const href = story.slug ? `/connect/stories/${story.slug.current}` : '#'

  return (
    <Card>
      <NextLink href={href} className="block">
        {story.image && <CardImage src={story.image.url} alt={story.image.alt} />}
        <div className="p-5">
          {story.pullQuote && (
            <blockquote className="font-display text-fg-heading text-lg font-medium">
              “{story.pullQuote}”
            </blockquote>
          )}
          <p className="text-fg-muted mt-3 text-sm font-medium">
            {story.isAnonymous ? 'Anonymous' : story.authorName}
          </p>
          {story.themes && story.themes.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {story.themes.map((theme) => (
                <span
                  key={theme}
                  className="rounded-pill bg-muted text-fg-muted px-2 py-0.5 text-xs"
                >
                  #{theme}
                </span>
              ))}
            </div>
          )}
        </div>
      </NextLink>
    </Card>
  )
}
