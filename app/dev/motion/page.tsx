import { notFound } from 'next/navigation'
import { Hero } from '@/components/blocks/hero'
import { MissionStatementBlock } from '@/components/blocks/mission-statement-block'
import { PillarsBlock } from '@/components/blocks/pillars-block'
import { StatsBlock } from '@/components/blocks/stats-block'
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

  const mission = homePageSections.find((s) => s._type === 'missionStatementBlock')
  const pillars = homePageSections.find((s) => s._type === 'pillarsBlock')
  const stats = homePageSections.find((s) => s._type === 'statsBlock')

  return (
    <div className="bg-canvas">
      <div className="bg-warning-bg text-warning-text p-3 text-center text-sm">
        /dev/motion — not linked anywhere, excluded from production (notFound() when
        NODE_ENV=production). Shows all five exaggerated moments in isolation for sign-off,
        replacing the motion-prototype video from Phase 1.
      </div>

      <MomentLabel n={1} title="Homepage hero" />
      <Hero data={homePageHero} animation="exaggerated" />

      <MomentLabel n={2} title="Mission statement" />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- fixture block shape matches the component prop at runtime */}
      <MissionStatementBlock data={mission as any} />

      <MomentLabel n={3} title="Pillars (scroll-pinned stack)" />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- fixture block shape matches the component prop at runtime */}
      <PillarsBlock data={pillars as any} />

      <MomentLabel n={4} title="Impact stats" />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- fixture block shape matches the component prop at runtime */}
      <StatsBlock data={stats as any} />

      <MomentLabel n={5} title="Stories carousel (mock cards — story schema ships Phase 4)" />
      <div className="mx-auto max-w-4xl px-4 py-16">
        <StoriesCarouselDemo />
      </div>
    </div>
  )
}
