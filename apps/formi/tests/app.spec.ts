import { test, expect } from '@playwright/test'

test.describe('app page', () => {
  test('has a model input', async ({ page }) => {
    await page.goto('/app')

    const modelInput = page.getByTestId('model-input')
    await expect(modelInput).toBeVisible()
    await expect(modelInput).toContainText(`
domain: [1, 2, 3]

constants:  a: 1  b: 2

functions:
  f:
    - 1,1
    - 2,1
    - 3,2
relations:
  R: [3]
  W:
    - 1,1
    - 2,3
`, { useInnerText: true })
  })

  test('has a model graph', async ({ page }) => {
    await page.goto('/app')

    const modelGraph = page.getByTestId('model-graph')
    await expect(modelGraph).toBeVisible()
    await expect(modelGraph.locator('circle.node')).toHaveCount(3)
    await expect(modelGraph.locator('path.link')).toHaveCount(4)
  })

  test('has a formula input and output', async ({ page }) => {
    await page.goto('/app')

    const formulaInput = page.getByTestId('formula-input')
    await expect(formulaInput).toBeVisible()
    await expect(formulaInput).toHaveValue('exists x. W(x,x) && f(b) = x')

    const formulaOutput = page.getByTestId('formula-output')
    await expect(formulaOutput).toBeVisible()
    await expect(formulaOutput).toHaveText('∃x. W(x,x) ∧ f(b) = x')
  })

  test('has a model checker output', async ({ page }) => {
    await page.goto('/app')

    const rootTrace = page.getByTestId('model-checker-trace-root')
    await expect(rootTrace).toBeVisible()
    await expect(rootTrace.locator('code').nth(0)).toHaveText('∃x. W(x,x) ∧ f(b) = x')
    const childTraces = rootTrace.getByTestId('model-checker-trace-child')
    await expect(childTraces.locator('code').nth(0)).toHaveText('W(1,1) ∧ f(b) = 1')
    await expect(childTraces.locator('code').nth(1)).toHaveText('W(1,1)')
    await expect(childTraces.locator('code').nth(2)).toHaveText('f(b) = 1')
  })
})
