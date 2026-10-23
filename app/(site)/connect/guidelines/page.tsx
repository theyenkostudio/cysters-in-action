import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlockRenderer } from '@/components/blocks/block-renderer'
import { Reveal } from '@/components/motion/reveal'
import { getPageBySlug } from '@/lib/sanity/content'
import { seoToMetadata } from '@/lib/seo'

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

  return (
    <>
      <Reveal className="mx-auto max-w-3xl px-4 pt-20 pb-4 sm:px-8">
        <h1 className="font-display text-fg-heading text-4xl font-semibold">{page.title}</h1>
      </Reveal>
      <BlockRenderer sections={page.sections} />
    </>
  )
}
