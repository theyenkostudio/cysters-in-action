import type { StoryRef } from '@/lib/sanity/types'

/** Plain-text paragraphs of a story body (Portable Text -> string[]). */
export function storyParagraphs(story: StoryRef): string[] {
  return story.body
    .map((block) =>
      (Array.isArray(block.children) ? block.children : [])
        .map((span) =>
          typeof span === 'object' && span && 'text' in span ? String(span.text ?? '') : '',
        )
        .join(''),
    )
    .filter((text) => text.trim().length > 0)
}

export function storyByline(story: StoryRef): string {
  const who = story.isAnonymous ? 'Anonymous' : (story.authorName ?? 'Anonymous')
  return [who, story.ageRange?.replace('-', '–')].filter(Boolean).join(', ')
}

export function storyDate(story: StoryRef): string {
  const iso = story.approvedAt ?? story.submittedAt
  return new Date(iso)
    .toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    .toUpperCase()
}
