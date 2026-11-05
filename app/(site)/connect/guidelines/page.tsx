import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { GuidelinesToc } from '@/components/connect/guidelines-toc'
import { Reveal } from '@/components/motion/reveal'
import { RichText } from '@/components/portable-text'
import { getPageBySlug } from '@/lib/sanity/content'
import { seoToMetadata } from '@/lib/seo'
import type { RichTextValue } from '@/lib/sanity/types'
import { extractHeadings } from '@/lib/toc'

// Lives at /connect/guidelines per Section 5's IA — the underlying content
// document's slug stays "community-guidelines" (that's where it's been
// since Phase 2, and other fixtures link to it by that slug); the old URL
// now redirects here (see next.config.ts).
const SLUG = 'community-guidelines'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(SLUG)
  if (!page) return {}
  return seoToMetadata(page.seo, { title: page.title }, '/connect/guidelines')
}

export default async function GuidelinesPage() {
  const page = await getPageBySlug(SLUG)
  if (!page) notFound()

  const richText = page.sections?.find((s) => s._type === 'richTextBlock') as
    { content?: RichTextValue } | undefined
  const content = richText?.content ?? []
  const entries = extractHeadings(content).filter((e) => e.level === 2)

  return (
    <div className="mx-auto max-w-6xl px-4 pt-16 pb-24 sm:px-6 sm:pt-24">
      <Reveal>
        <h1 className="font-display text-fg-heading text-4xl font-semibold sm:text-5xl">
          {page.title}
        </h1>
      </Reveal>

      <div className="mt-10 grid gap-16 lg:grid-cols-[minmax(0,42rem)_1fr]">
        <div id="guidelines-content" className="[&_h2]:scroll-mt-28 [&>h2:first-child]:mt-0">
          <RichText value={content} />
        </div>
        <GuidelinesToc entries={entries} />
      </div>
    </div>
  )
}
