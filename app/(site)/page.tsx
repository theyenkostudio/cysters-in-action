import type { Metadata } from 'next'
import { BlockRenderer } from '@/components/blocks/block-renderer'
import { Hero } from '@/components/blocks/hero'
import { getHomePage } from '@/lib/sanity/content'
import { seoToMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const homePage = await getHomePage()
  return seoToMetadata(homePage?.seo, { title: 'Home' })
}

export default async function HomePage() {
  const homePage = await getHomePage()
  if (!homePage) return null

  return (
    <>
      <Hero data={homePage.hero} animation="exaggerated" />
      <BlockRenderer sections={homePage.sections} />
    </>
  )
}
