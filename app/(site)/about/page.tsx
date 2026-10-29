import type { Metadata } from 'next'
import { FoundingCircleRow } from '@/components/about/founding-circle-row'
import { StoryImage } from '@/components/about/story-image'
import { BlockRenderer } from '@/components/blocks/block-renderer'
import { Hero } from '@/components/blocks/hero'
import { PillarsBlock } from '@/components/blocks/pillars-block'
import { Reveal, Stagger } from '@/components/motion/reveal'
import { RichText } from '@/components/portable-text'
import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import { getAboutPage } from '@/lib/sanity/content'
import { seoToMetadata } from '@/lib/seo'
import { cn } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const aboutPage = await getAboutPage()
  return seoToMetadata(aboutPage?.seo, { title: 'About' }, '/about')
}

export default async function AboutPage() {
  const aboutPage = await getAboutPage()
  if (!aboutPage) return null

  return (
    <>
      <Hero data={aboutPage.hero} animation="subtle" />

      {/* Horizontal padding lives on this full-width wrapper, with an unpadded
          mx-auto max-w-5xl box centered inside it — matching Hero's own
          structure above. Putting px-4/sm:px-8 directly on a max-w-5xl
          element instead (as every other section on this page does) makes
          border-box padding eat into that max-width budget, insetting its
          content further from the edge than Hero's and breaking the
          alignment the user is comparing them on. */}
      <section id="mission" className="w-full px-4 py-16 sm:px-8">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:items-center">
          <Reveal className="order-2 md:order-1">
            <SectionEyebrow>Our story</SectionEyebrow>
            <RichText value={aboutPage.story} className="mt-4" />
          </Reveal>
          {aboutPage.storyImage && (
            <div className="order-1 md:order-2">
              <StoryImage image={aboutPage.storyImage} />
            </div>
          )}
        </div>
      </section>

      {aboutPage.pillars?.length > 0 && (
        <>
          <h2 className="sr-only">What we focus on</h2>
          <PillarsBlock data={{ pillars: aboutPage.pillars, animation: 'subtle' }} />
        </>
      )}

      {aboutPage.values?.length > 0 && (
        <section className="w-full px-4 py-16 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <SectionEyebrow as="h2">Our values</SectionEyebrow>
            </Reveal>
            <Stagger className="mt-2">
              {aboutPage.values.map((value, i) => (
                <Reveal
                  key={i}
                  className={cn(
                    'border-default grid grid-cols-1 items-start gap-2 border-t py-6 sm:grid-cols-[1fr_1.5fr] sm:gap-6',
                    i === aboutPage.values.length - 1 && 'border-b',
                  )}
                >
                  <h3 className="font-display text-fg-heading text-xl font-semibold">
                    {value.title}
                  </h3>
                  {value.body && (
                    <p className="text-fg-muted text-sm leading-relaxed">{value.body}</p>
                  )}
                </Reveal>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {aboutPage.foundingCircle?.length > 0 && (
        <section id="founding-circle" className="w-full py-16">
          {/* Heading keeps the same max-w-6xl/px inset as every other
              section. The slider below has no max-w and no right padding —
              so it isn't boxed in by a container edge and cards can run off
              the actual edge of the browser window — but its left inset has
              to replicate mx-auto's centering math (not just repeat px-8),
              or past max-w-6xl's breakpoint (viewport ~1152px+) the heading
              above keeps drifting rightward while this stays pinned to the
              viewport edge, so the row starts left of where the heading (and
              every other section) starts. */}
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <Reveal>
              <SectionEyebrow as="h2">
                {aboutPage.foundingCircleHeading ?? 'The Founding Circle'}
              </SectionEyebrow>
            </Reveal>
          </div>
          <FoundingCircleRow members={aboutPage.foundingCircle} />
        </section>
      )}

      <BlockRenderer sections={aboutPage.sections} />
    </>
  )
}
