import type { RichTextValue } from '@/lib/sanity/types'

/** Converts a plain textarea value into Portable Text paragraphs, split on blank lines. */
export function plainTextToRichText(text: string): RichTextValue {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((paragraph, i) => ({
      _type: 'block',
      _key: `p${i}`,
      style: 'normal',
      children: [{ _type: 'span', _key: `p${i}-span`, text: paragraph }],
    }))
}
