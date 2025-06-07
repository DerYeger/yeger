import { test, expect } from '@playwright/test'

test.describe('landing page', () => {
  test('has a header and descriptions', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('h2')).toHaveText('FOL Model Checking')
    await expect(page.getByTestId('hero-prose')).toHaveCount(2)
  })

  test('has a try now button', async ({ page }) => {
    await page.goto('/')

    await page.getByTestId('link-button-/app').click()
    await expect(page).toHaveURL(/\/app/)
  })

  test('has a read more button', async ({ page }) => {
    await page.goto('/')

    await page.getByTestId('link-button-/features').click()
    await expect(page).toHaveURL(/\/features/)
  })
})
