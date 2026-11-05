import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlockRenderer } from '@/components/blocks/block-renderer'
import { Hero } from '@/components/blocks/hero'
import { Reveal } from '@/components/motion/reveal'
import { getAllPageSlugs, getPageBySlug } from '@/lib/sanity/content'
import { seoToMetadata } from '@/lib/seo'

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs()
  return slugs.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) return {}
  return seoToMetadata(page.seo, { title: page.title }, `/${slug}`)
}

export default async function GenericPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) notFound()

  return (
    <>
      {page.hero ? (
        <Hero data={page.hero} animation="subtle" />
      ) : (
        <Reveal className="mx-auto max-w-2xl px-4 pt-16 pb-0 sm:px-8 sm:pt-24">
          <h1 className="font-display text-fg-heading text-4xl font-semibold sm:text-5xl">
            {page.title}
          </h1>
        </Reveal>
      )}
      <BlockRenderer sections={page.sections} />
    </>
  )
}
