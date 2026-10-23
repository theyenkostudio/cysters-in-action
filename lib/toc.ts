import type { RichTextValue } from './sanity/types'
import { slugify } from './slugify'

export type TocEntry = { text: string; slug: string; level: 2 | 3 }

export function extractHeadings(body: RichTextValue): TocEntry[] {
  return body
    .filter((block) => block._type === 'block' && (block.style === 'h2' || block.style === 'h3'))
    .map((block) => {
      const text =
        (block.children as { text?: string }[] | undefined)?.map((c) => c.text ?? '').join('') ?? ''
      return {
        text,
        slug: slugify(text),
        level: block.style === 'h2' ? (2 as const) : (3 as const),
      }
    })
    .filter((entry) => entry.text)
}
