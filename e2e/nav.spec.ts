import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
for (const group of ['About', 'Learn', 'Connect']) {
  test(`axe: ${group} dropdown`, async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(1500)
    await page
      .getByRole('navigation', { name: 'Main' })
      .getByRole('button', { name: group })
      .hover()
    await page.waitForTimeout(1500)
    await expect(page.locator('.nav-panel')).toBeVisible()
    const r = await new AxeBuilder({ page })
      .include('header')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()
    expect(
      r.violations,
      JSON.stringify(
        r.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.html.slice(0, 120)) })),
        null,
        2,
      ),
    ).toEqual([])
  })
}
test('keyboard opens a dropdown and Escape closes it', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(1500)
  await page
    .getByRole('navigation', { name: 'Main' })
    .getByRole('button', { name: 'Learn' })
    .focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('.nav-panel')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.locator('.nav-panel')).toHaveCount(0)
})
