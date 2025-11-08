import { test, expect } from '@playwright/test'

test.describe('features page', () => {
  test('has a header', async ({ page }) => {
    await page.goto('/features')

    await expect(page.locator('h1')).toHaveText(`Formi's Features`)
  })

  test('has a model section', async ({ page }) => {
    await page.goto('/features')

    const modelSection = page.getByTestId('features-section-Models')
    await modelSection.scrollIntoViewIfNeeded()
    await expect(modelSection).toBeVisible()
    await expect(modelSection.getByTestId('feature-paragraph')).toBeVisible()

    const demo = modelSection.getByTestId('demo-card').getByTestId('model-input')
    await demo.scrollIntoViewIfNeeded()
    await expect(demo).toBeVisible()
    await expect(demo).toContainText(
      `
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
`,
      { useInnerText: true },
    )
  })

  test('has a graph section', async ({ page }) => {
    await page.goto('/features')

    const graphSection = page.getByTestId('features-section-Graphs')
    await graphSection.scrollIntoViewIfNeeded()
    await expect(graphSection).toBeVisible()
    await expect(graphSection.getByTestId('feature-paragraph')).toBeVisible()

    const demo = graphSection.getByTestId('demo-card').getByTestId('model-graph')
    await demo.scrollIntoViewIfNeeded()
    await expect(demo).toBeVisible()
    await expect(demo.locator('circle.node')).toHaveCount(3)
    await expect(demo.locator('path.link')).toHaveCount(4)
  })

  test('has a formula section', async ({ page }) => {
    await page.goto('/features')

    const formulaSection = page.getByTestId('features-section-Formulas')
    await formulaSection.scrollIntoViewIfNeeded()
    await expect(formulaSection).toBeVisible()
    await expect(
      formulaSection.getByTestId('feature-paragraph').filter({ visible: true }),
    ).toHaveCount(2)

    const parsingDemo = formulaSection.getByTestId('demo-card').nth(0)
    await parsingDemo.scrollIntoViewIfNeeded()
    await expect(parsingDemo).toBeVisible()
    await expect(parsingDemo.locator('span').nth(0)).toHaveText('exists x. W(x,x) && f(b) = x')
    await expect(parsingDemo.locator('code')).toHaveText('∃x. W(x,x) ∧ f(b) = x')

    const treeDemo = formulaSection.getByTestId('demo-card').nth(1).getByTestId('fol-tree')
    await treeDemo.scrollIntoViewIfNeeded()
    await expect(treeDemo).toBeVisible()
    await expect(treeDemo).toHaveText('∃x∧Wxx=f()bx')
  })

  test('has a model checking section', async ({ page }) => {
    await page.goto('/features')

    const modelCheckingSection = page.getByTestId('features-section-Model Checking')
    await modelCheckingSection.scrollIntoViewIfNeeded()
    await expect(modelCheckingSection).toBeVisible()
    await expect(modelCheckingSection.getByTestId('feature-paragraph')).toBeVisible()

    const demo = modelCheckingSection
      .getByTestId('demo-card')
      .getByTestId('model-checker-trace-root')
    await demo.scrollIntoViewIfNeeded()
    await expect(demo).toBeVisible()
    await expect(demo.locator('code').nth(0)).toHaveText('∃x. W(x,x) ∧ f(b) = x')
    const childTraces = demo.getByTestId('model-checker-trace-child')
    await expect(childTraces.locator('code').nth(0)).toHaveText('W(1,1) ∧ f(b) = 1')
    await expect(childTraces.locator('code').nth(1)).toHaveText('W(1,1)')
    await expect(childTraces.locator('code').nth(2)).toHaveText('f(b) = 1')
  })
})
