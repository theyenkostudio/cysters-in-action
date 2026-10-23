import type { Metadata } from 'next'
import { GlossaryAzList } from '@/components/glossary/glossary-az-list'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Reveal } from '@/components/motion/reveal'
import { getGlossaryTerms } from '@/lib/sanity/content'
import { seoToMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return seoToMetadata(
    undefined,
    { title: 'Glossary', description: 'Plain-language definitions of PMOS-related terms.' },
    '/learn/glossary',
  )
}

export default async function GlossaryPage() {
  const terms = await getGlossaryTerms()

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
      <Reveal>
        <Eyebrow>Learn</Eyebrow>
        <h1 className="font-display text-fg-heading mt-4 text-4xl font-semibold">Glossary</h1>
        <p className="text-fg-muted mt-3 max-w-xl">
          Plain-language definitions for words you’ll see across the Learn hub.
        </p>
      </Reveal>

      <div className="mt-10">
        <GlossaryAzList terms={terms} />
      </div>
    </div>
  )
}
