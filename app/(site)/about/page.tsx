import type { Metadata } from 'next'
import { TeamMemberCard } from '@/components/about/team-member-card'
import { BlockRenderer } from '@/components/blocks/block-renderer'
import { Hero } from '@/components/blocks/hero'
import { PillarsBlock } from '@/components/blocks/pillars-block'
import { Reveal, Stagger } from '@/components/motion/reveal'
import { RichText } from '@/components/portable-text'
import { getAboutPage } from '@/lib/sanity/content'
import { seoToMetadata } from '@/lib/seo'

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

      <Reveal className="mx-auto max-w-2xl px-4 py-16 sm:px-8">
        <p className="text-fg-subtle text-sm font-semibold tracking-wide uppercase">Our story</p>
        <RichText value={aboutPage.story} className="mt-2" />
      </Reveal>

      {aboutPage.pillars?.length > 0 && (
        <PillarsBlock data={{ pillars: aboutPage.pillars, animation: 'subtle' }} />
      )}

      {aboutPage.values?.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-8">
          <Stagger className="grid gap-6 sm:grid-cols-3">
            {aboutPage.values.map((value, i) => (
              <Reveal key={i} className="rounded-card border-default border p-6">
                <h3 className="font-display text-fg-heading font-semibold">{value.title}</h3>
                {value.body && <p className="text-fg-muted mt-2 text-sm">{value.body}</p>}
              </Reveal>
            ))}
          </Stagger>
        </section>
      )}

      {aboutPage.foundingCircle?.length > 0 && (
        <section id="founding-circle" className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
          <Reveal>
            <h2 className="font-display text-fg-heading text-center text-3xl font-semibold">
              {aboutPage.foundingCircleHeading ?? 'The Founding Circle'}
            </h2>
          </Reveal>
          <Stagger className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {aboutPage.foundingCircle.map((member) => (
              <Reveal key={member._id}>
                <TeamMemberCard member={member} />
              </Reveal>
            ))}
          </Stagger>
        </section>
      )}

      <BlockRenderer sections={aboutPage.sections} />
    </>
  )
}
