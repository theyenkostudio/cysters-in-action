import type { RichTextValue } from './sanity/types'

const WORDS_PER_MINUTE = 200

/** Computed at render time from the body's word count (Section 6: article.readingTime). */
export function estimateReadingTime(body: RichTextValue): number {
  const wordCount = body
    .filter((block) => block._type === 'block')
    .flatMap((block) => (Array.isArray(block.children) ? block.children : []))
    .map((span) => (span as { text?: string }).text ?? '')
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length

  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE))
}
