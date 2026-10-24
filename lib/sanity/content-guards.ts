import type { AboutStatValue, PageBuilderBlock } from './types'

/**
 * Pre-launch safety net for aboutIntroBlock's stats (Section 5): throws if
 * any stat is still marked `_placeholder: true` (our own fixture convention
 * — see lib/sanity/fixtures/homePage.ts) or has an empty `source`. Called
 * from getHomePage() gated to `NODE_ENV === 'production'`, so `next build`
 * genuinely fails while placeholder impact numbers are still wired up, but
 * `next dev`/tests are never affected.
 */
export function assertAboutStatsReady(stats: AboutStatValue[] | undefined): void {
  if (!stats) return
  for (const stat of stats) {
    if (stat._placeholder) {
      throw new Error(
        `aboutIntroBlock stat "${stat.label}" is still marked _placeholder: true — replace it with a real, sourced figure before shipping to production.`,
      )
    }
    if (!stat.source?.trim()) {
      throw new Error(
        `aboutIntroBlock stat "${stat.label}" has no source — every impact figure needs a verifiable source before shipping to production.`,
      )
    }
  }
}

/** Runs the guard above against whichever section is the homepage's aboutIntroBlock, if any. */
export function assertHomePageReady(sections: PageBuilderBlock[] | undefined): void {
  if (process.env.NODE_ENV !== 'production') return
  const aboutIntro = sections?.find((section) => section._type === 'aboutIntroBlock')
  assertAboutStatsReady(aboutIntro?.stats as AboutStatValue[] | undefined)
}
