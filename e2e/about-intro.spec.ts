import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const HEADING_TEXT = 'Together, we turn PMOS questions into action.'

// The stats row is parked (SHOW_STATS = false in about-intro-block.tsx) while
// the numbers get a new home. Tests that need the stat cards are skipped, not
// deleted: flip this to false when the row comes back.
const STATS_PARKED = true

async function scrollAboutIntroIntoView(page: Page) {
  await page.goto('/')
  const heading = page.getByRole('heading', { level: 2, name: HEADING_TEXT })
  await heading.scrollIntoViewIfNeeded()
  return heading
}

/**
 * Scrolls well past the stats row and waits for every animation (scrubbed
 * paragraph reveal, stat count-up, sup pop, underline draw) to fully
 * settle. The paragraph's scrub is tied to scroll position — a small,
 * fixed wheel delta can land short of its `end` trigger depending on exact
 * viewport metrics, intermittently catching a still-dimming word (an
 * intentional, specified mid-animation state per the design, not a real
 * contrast defect) rather than the final, fully-revealed text.
 */
async function settleAboutIntroAnimations(page: Page) {
  await scrollAboutIntroIntoView(page)
  const statsRow = page.locator('[data-stat-card]').first()
  if (!STATS_PARKED) await statsRow.scrollIntoViewIfNeeded()
  await page.mouse.wheel(0, 600)
  await page.waitForTimeout(2800)
}

test.describe('aboutIntroBlock', () => {
  for (const width of [1024, 1280, 1440, 768]) {
    test(`renders the reference layout at ${width}px`, async ({ page }) => {
      test.skip(STATS_PARKED, 'reference screenshots include the stats row, which is parked')
      await page.setViewportSize({ width, height: 1000 })
      await scrollAboutIntroIntoView(page)
      // Scroll a little further so the stats row (below the fold at this
      // point) has entered and finished its reveal/count-up before the shot.
      // (Keeping the heading in frame matters here, unlike the axe/settle
      // helper below, which scrolls well past it on purpose.)
      await page.mouse.wheel(0, 200)
      await page.waitForTimeout(2600)
      await expect(page.locator('section', { has: page.getByText(HEADING_TEXT) })).toHaveScreenshot(
        `about-intro-${width}.png`,
        { maxDiffPixelRatio: 0.02 },
      )
    })
  }

  test('final stat values are present for screen readers', async ({ page }) => {
    test.skip(STATS_PARKED, 'stats row is parked')
    await scrollAboutIntroIntoView(page)

    const srStats = page.locator('li .sr-only')
    await expect(srStats).toHaveCount(3)
    await expect(srStats.nth(0)).toHaveText(/120 plus, Community members/i)
    await expect(srStats.nth(1)).toHaveText(/18 plus, Stories shared/i)
    await expect(srStats.nth(2)).toHaveText(/^6, Events hosted$/i)

    // The animated number itself must stay out of the accessibility tree —
    // the sr-only span above is what's actually read.
    const numbers = page.locator('[data-stat-number]')
    for (let i = 0; i < (await numbers.count()); i++) {
      await expect(numbers.nth(i)).toHaveAttribute('aria-hidden', 'true')
    }
  })

  test('the full heading and paragraph are exposed as single accessible strings', async ({
    page,
  }) => {
    await scrollAboutIntroIntoView(page)
    const heading = page.getByRole('heading', { level: 2, name: HEADING_TEXT })
    await expect(heading).toHaveAttribute('aria-label', HEADING_TEXT)
    // The visible, possibly-SplitText-mangled content is hidden from AT —
    // only the sr-only sibling (or the heading's own aria-label) is read.
    await expect(heading.locator('[aria-hidden="true"]').first()).toBeVisible()
  })

  test('with reduced motion, final numbers are visible immediately — no count-up', async ({
    page,
  }) => {
    test.skip(STATS_PARKED, 'stats row is parked')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await scrollAboutIntroIntoView(page)
    // Deliberately short wait — long enough for the (skipped) count-up
    // tween to have barely started if it were running, nowhere near its
    // real 1.6s duration.
    await page.waitForTimeout(300)

    const numbers = page.locator('[data-stat-number]')
    await expect(numbers.nth(0)).toHaveText('120')
    await expect(numbers.nth(1)).toHaveText('18')
    await expect(numbers.nth(2)).toHaveText('6')
  })

  test('no console or page errors on load, scroll, or under reduced motion', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await page.emulateMedia({ reducedMotion: 'reduce' })
    await scrollAboutIntroIntoView(page)
    await page.waitForTimeout(1000)

    expect(errors).toEqual([])
  })

  test('axe has no violations on the about-intro section', async ({ page }) => {
    await settleAboutIntroAnimations(page)

    // Scoped to this block's own section (via its heading)
    // so a pre-existing issue elsewhere on the page can't fail this test.
    const results = await new AxeBuilder({ page })
      .include(`section:has(h2[aria-label="${HEADING_TEXT}"])`)
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
  })

  test('no meaningful layout shift during the stat count-up (CLS ≈ 0)', async ({ page }) => {
    test.skip(STATS_PARKED, 'stats row is parked')
    await page.goto('/')
    await page.evaluate(() => {
      ;(window as unknown as { __shifts: number[] }).__shifts = []
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as unknown as { value: number; hadRecentInput: boolean }
          if (!shift.hadRecentInput) {
            ;(window as unknown as { __shifts: number[] }).__shifts.push(shift.value)
          }
        }
      })
      observer.observe({ type: 'layout-shift', buffered: true })
    })

    const heading = page.getByRole('heading', { level: 2, name: HEADING_TEXT })
    await heading.scrollIntoViewIfNeeded()
    await page.mouse.wheel(0, 200)
    await page.waitForTimeout(3000) // covers the full 1.6s count-up plus entrance/pop/draw

    const totalShift = await page.evaluate(() =>
      (window as unknown as { __shifts: number[] }).__shifts.reduce((a, b) => a + b, 0),
    )
    expect(totalShift).toBeLessThan(0.01)
  })
})
