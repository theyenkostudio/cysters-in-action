import { Eyebrow } from '@/components/ui/eyebrow'
import { Reveal } from '@/components/motion/reveal'

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-24">
      <Reveal>
        <Eyebrow>Cysters In Action</Eyebrow>
        <h1 className="text-fg-heading mt-4 max-w-2xl text-4xl font-semibold md:text-6xl">
          Learn, Connect, Act.
        </h1>
        <p className="text-fg-muted mt-4 max-w-xl text-lg">
          The homepage page-builder sections (hero, mission statement, pillars, stats, stories
          carousel...) ship in Phase 2 once the block schemas and the Learn hub exist. This
          placeholder confirms the Phase 1 shell — announcement bar, nav and footer, all driven by
          Sanity — is wired up end to end.
        </p>
      </Reveal>
    </div>
  )
}
