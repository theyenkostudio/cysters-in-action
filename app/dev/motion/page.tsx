import { notFound } from 'next/navigation'
import { AboutIntroBlock } from '@/components/blocks/about-intro-block'
import { Hero } from '@/components/blocks/hero'
import { WaysWeShowUpBlock } from '@/components/blocks/WaysWeShowUp'
import { StoriesCarouselDemo } from '@/components/dev/stories-carousel-demo'
import { homePageHero, homePageSections } from '@/lib/sanity/fixtures/homePage'

export const metadata = { robots: { index: false, follow: false } }

function MomentLabel({ n, title }: { n: number; title: string }) {
  return (
    <div className="rounded-pill bg-plum-900 sticky top-4 z-20 mx-auto max-w-fit px-4 py-1.5 text-sm font-medium text-white">
      Moment {n} — {title}
    </div>
  )
}

export default function DevMotionPage() {
  if (process.env.NODE_ENV === 'production') notFound()

  const aboutIntro = homePageSections.find((s) => s._type === 'aboutIntroBlock')
  const waysWeShowUp = homePageSections.find((s) => s._type === 'waysWeShowUpBlock')

  return (
    <div className="bg-canvas">
      <div className="bg-warning-bg text-warning-text p-3 text-center text-sm">
        /dev/motion — not linked anywhere, excluded from production (notFound() when
        NODE_ENV=production). Shows all exaggerated moments in isolation for sign-off, replacing the
        motion-prototype video from Phase 1.
      </div>

      <MomentLabel n={1} title="Homepage hero" />
      <Hero data={homePageHero} animation="exaggerated" />

      <MomentLabel
        n={2}
        title="About intro — split heading, scrubbed paragraph reveal, stat count-up"
      />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- fixture block shape matches the component prop at runtime */}
      <AboutIntroBlock data={aboutIntro as any} />

      <MomentLabel n={3} title="Ways we show up (scroll-pinned, shuffling card stack)" />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- fixture block shape matches the component prop at runtime */}
      <WaysWeShowUpBlock data={waysWeShowUp as any} />

      <MomentLabel n={4} title="Stories carousel (mock cards — story schema ships Phase 4)" />
      <div className="mx-auto max-w-4xl px-4 py-16">
        <StoriesCarouselDemo />
      </div>
    </div>
  )
}
