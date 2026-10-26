import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const HEADING_SELECTOR = 'h2:has-text("THREE WAYS")'
// Plain CSS (not Playwright's `:has-text()`), so it also works as the
// `.include()` target for axe-core, which runs via native querySelectorAll.
const SECTION_SELECTOR = '[data-wwsu-section]'

async function scrollIntoView(page: Page, viewport?: { width: number; height: number }) {
  if (viewport) await page.setViewportSize(viewport)
  await page.goto('/')
  // A real reduced-motion user's useReducedMotion() value starts `false`
  // (matching SSR) and flips to `true` moments after mount — which remounts
  // anything wrapped in <Reveal> (it renders a different root element type
  // per that flag). That remount's exact timing varies under parallel
  // worker load, so retry the scroll action rather than trust one fixed
  // delay to always win the race.
  const heading = page.locator(HEADING_SELECTOR).first()
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await heading.scrollIntoViewIfNeeded({ timeout: 2000 })
      break
    } catch {
      await page.waitForTimeout(300)
    }
  }
  await page.waitForTimeout(600)
  return heading
}

/** Front card's word + whichever description is actually opaque right now. */
async function activeState(page: Page) {
  return page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-card-index]'))
      .map((card) => ({
        word: card.querySelector('[data-distressed-word]')?.textContent ?? '',
        zIndex: Number(getComputedStyle(card).zIndex) || 0,
      }))
      .sort((a, b) => b.zIndex - a.zIndex)
    const front = cards[0]?.word ?? null

    const descriptions = Array.from(
      document.querySelectorAll<HTMLElement>('[data-wwsu-description]'),
    )
    const visible = descriptions.find((el) => Number(getComputedStyle(el).opacity) > 0.5)
    return { front, description: visible?.textContent?.trim() ?? null }
  })
}

/** Scrolls by `px` in small wheel increments (so Lenis/scrub settle smoothly), then waits. */
async function scrollAndSettle(page: Page, px: number) {
  await page.mouse.move(640, 450)
  const chunks = Math.max(1, Math.ceil(Math.abs(px) / 60))
  for (let i = 0; i < chunks; i++) {
    await page.mouse.wheel(0, px / chunks)
    await page.waitForTimeout(60)
  }
  await page.waitForTimeout(1000) // let scrub (0.6) and the snap settle
}

for (const { label, viewport } of [
  { label: 'desktop', viewport: { width: 1280, height: 900 } },
  { label: 'mobile', viewport: { width: 390, height: 844 } },
]) {
  test.describe(`waysWeShowUpBlock — ${label}`, () => {
    test('pins and shuffles LEARN -> CONNECT -> ACT as the user scrolls, in order', async ({
      page,
    }) => {
      await scrollIntoView(page, viewport)

      const start = await activeState(page)
      expect(start.front).toBe('Learn')
      expect(start.description).toMatch(/chasing a diagnosis alone/i)

      // Pin length is (cards-1) * stepVh of the viewport height — step
      // through roughly one step's worth of scroll at a time.
      const stepPx = Math.round((viewport.height * (label === 'mobile' ? 55 : 70)) / 100)

      await scrollAndSettle(page, stepPx)
      const afterStep1 = await activeState(page)
      expect(afterStep1.front).toBe('Connect')
      expect(afterStep1.description).toMatch(/not the only one/i)

      await scrollAndSettle(page, stepPx)
      const afterStep2 = await activeState(page)
      expect(afterStep2.front).toBe('Act')
      expect(afterStep2.description).toMatch(/understanding alone is not enough/i)

      // Pin has released — more scrolling should move the page normally,
      // not change which card is active.
      const scrollYAtRelease = await page.evaluate(() => window.scrollY)
      await scrollAndSettle(page, 400)
      const scrollYAfter = await page.evaluate(() => window.scrollY)
      expect(scrollYAfter).toBeGreaterThan(scrollYAtRelease)
      const afterRelease = await activeState(page)
      expect(afterRelease.front).toBe('Act')
    })

    test('scrolling back up reverses the shuffle cleanly', async ({ page }) => {
      await scrollIntoView(page, viewport)
      const stepPx = Math.round((viewport.height * (label === 'mobile' ? 60 : 80)) / 100)

      await scrollAndSettle(page, stepPx * 2) // forward through both steps
      expect((await activeState(page)).front).toBe('Act')

      await scrollAndSettle(page, -stepPx * 2) // back to the start
      const back = await activeState(page)
      expect(back.front).toBe('Learn')
    })
  })
}

test.describe('waysWeShowUpBlock — accessibility', () => {
  test('reduced motion: all 3 descriptions are visible without scrolling the pin', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await scrollIntoView(page, { width: 1280, height: 900 })

    const words = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[data-distressed-word]')).map((el) => el.textContent),
    )
    expect(words).toEqual(['Learn', 'Connect', 'Act'])

    // No pin under reduced motion — a big wheel scroll should move the page
    // by roughly that amount, not get arrested by a pinned section.
    const before = await page.evaluate(() => window.scrollY)
    await page.mouse.wheel(0, 1500)
    await page.waitForTimeout(400)
    const after = await page.evaluate(() => window.scrollY)
    expect(after - before).toBeGreaterThan(1000)
  })

  test('the animated stack is aria-hidden; AccessibleList carries the full content', async ({
    page,
  }) => {
    await scrollIntoView(page, { width: 1280, height: 900 })

    const stackHidden = await page.evaluate(() => {
      const card = document.querySelector('[data-card-index]')
      return card?.closest('[aria-hidden="true"]') != null
    })
    expect(stackHidden).toBe(true)

    const list = page.locator('ol.sr-only li')
    await expect(list).toHaveCount(3)
    await expect(list.nth(0)).toContainText('Learn')
    await expect(list.nth(1)).toContainText('Connect')
    await expect(list.nth(2)).toContainText('Act')
  })

  test('no decorative link inside the hidden stack is a stray tab stop', async ({ page }) => {
    await scrollIntoView(page, { width: 1280, height: 900 })
    const decorativeLinks = page.locator('[data-wwsu-description] a')
    const count = await decorativeLinks.count()
    for (let i = 0; i < count; i++) {
      await expect(decorativeLinks.nth(i)).toHaveAttribute('tabindex', '-1')
    }
  })

  test('no console or page errors across load, scroll, and reduced motion', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await scrollIntoView(page, { width: 1280, height: 900 })
    await scrollAndSettle(page, 1500)

    await page.emulateMedia({ reducedMotion: 'reduce' })
    await scrollIntoView(page, { width: 1280, height: 900 })

    expect(errors).toEqual([])
  })

  test('axe has no violations on the section', async ({ page }) => {
    await scrollIntoView(page, { width: 1280, height: 900 })

    const results = await new AxeBuilder({ page })
      .include(SECTION_SELECTOR)
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
  })

  test('axe has no violations on the reduced-motion fallback', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await scrollIntoView(page, { width: 1280, height: 900 })

    const results = await new AxeBuilder({ page })
      .include(SECTION_SELECTOR)
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
  })
})

test.describe('waysWeShowUpBlock — visual', () => {
  for (const width of [1280, 390]) {
    test(`matches the reference layout at ${width}px (first card, Learn)`, async ({ page }) => {
      await scrollIntoView(page, { width, height: width < 768 ? 844 : 900 })
      // Wait for a concrete signal that the GSAP mount effect (dynamic
      // import -> gsap.context() -> resting-pose gsap.set calls) has
      // actually finished, rather than guessing a fixed delay — a blind
      // wait was occasionally too short on a cold dev-server compile,
      // catching the layout mid-shift and failing Playwright's own
      // screenshot-stability check.
      await page.waitForFunction(() => {
        const card = document.querySelector('[data-card-index="0"]')
        return card ? getComputedStyle(card).zIndex !== 'auto' : false
      })
      await page.waitForTimeout(500) // plus a short settle for the entrance Reveal fade

      // expect(locator).toHaveScreenshot() auto-scrolls the element into
      // view as part of its action, re-checked on every stability poll —
      // Lenis intercepts that native scroll and smooths it, so each poll
      // can retrigger a fresh multi-frame animation that never converges
      // inside the timeout. The section is already fully in view (we just
      // scrolled it there and confirmed geometry is settled), so clipping
      // the page screenshot to its measured box sidesteps that entirely.
      const section = page.locator(SECTION_SELECTOR)
      const box = await section.boundingBox()
      if (!box) throw new Error('WaysWeShowUp section not found for screenshot')
      // Rounded down and capped: the live-measured box height can drift by
      // a few px run to run (font/layout rounding), and toHaveScreenshot
      // hard-fails on any dimension mismatch regardless of
      // maxDiffPixelRatio — clipping to a slightly smaller, whole-pixel,
      // fixed-feeling box keeps the compared images a stable size without
      // chasing exact sub-pixel geometry.
      const clip = {
        x: Math.round(box.x),
        y: Math.round(box.y),
        width: Math.floor(box.width),
        height: Math.max(100, Math.floor(box.height) - 10),
      }
      await expect(page).toHaveScreenshot(`ways-we-show-up-${width}.png`, {
        clip,
        maxDiffPixelRatio: 0.03,
      })
    })
  }
})
