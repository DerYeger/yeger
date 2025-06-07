import { test, expect } from '@playwright/test'

const TEST_STATION_NAME = 'Hietzing'

test('can save and remove favorites', async ({ page }) => {
  await page.goto('/')
  const searchForFavorites = page.getByTestId('search-favorites')

  // Initially, no favorites are available
  await expect(searchForFavorites).toBeVisible()
  await expect(page.getByTestId(`station-link-${TEST_STATION_NAME}`)).not.toBeVisible()

  // Go to all stations page
  await searchForFavorites.click()
  await expect(page).toHaveURL('/stations')

  // Search for a station and mark it as favorite
  await page.getByTestId('station-search-input').fill(TEST_STATION_NAME)
  await page.getByTestId(`station-favorite-toggle-no-${TEST_STATION_NAME}`).click()

  // Go back to the favorites page
  await page.getByTestId('nav-link-/').click()
  await expect(page).toHaveURL('/')

  // The favorite stations is now visible
  await expect(page.getByTestId(`station-favorite-toggle-yes-${TEST_STATION_NAME}`)).toBeVisible()
  // And the prompt is gone
  await expect(searchForFavorites).not.toBeVisible()

  // Removing that favorite shows the prompt again
  await page.getByTestId(`station-favorite-toggle-yes-${TEST_STATION_NAME}`).click()
  await expect(page.getByTestId(`station-link-${TEST_STATION_NAME}`)).not.toBeVisible()
  await expect(searchForFavorites).toBeVisible()
})

test('can open station details', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('nav-link-/stations').click()
  await expect(page).toHaveURL('/stations')

  // Search for a station open the details via its link
  await page.getByTestId('station-search-input').fill(TEST_STATION_NAME)
  await page.getByTestId(`station-link-${TEST_STATION_NAME}`).click()
  await expect(page).toHaveURL(`/stations/${TEST_STATION_NAME}`)

  // The station name is visible
  await expect(page.getByTestId('station-name')).toHaveText(TEST_STATION_NAME)

  // The stops are visible on a map
  const map = page.locator('.leaflet-container')
  await expect(map).toBeVisible()
  await expect(map.locator('.leaflet-marker-pane .leaflet-marker-icon')).toHaveCount(2)

  // The monitor information for the lines is shown
  const firstLine = page.getByTestId('line-U4-HEILIGENSTADT')
  await expect(firstLine).toBeVisible()
  await expect(firstLine.getByTestId('line-header')).toHaveText('U4 HEILIGENSTADT')
  const secondLine = page.getByTestId('line-U4-HÜTTELDORF')
  await expect(secondLine).toBeVisible()
  await expect(secondLine.getByTestId('line-header')).toHaveText('U4 HÜTTELDORF')
})

test('has a map for all stations', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('nav-link-/map').click()
  await expect(page).toHaveURL('/map')

  const map = page.locator('.leaflet-container')
  await expect(map).toBeVisible()

  async function zoomUntilAnyStationVisible() {
    const visibleStations = await map.locator('.leaflet-marker-pane .leaflet-marker-icon:not(.marker-cluster)').filter({ visible: true }).all()
    if (visibleStations.length === 0) {
      await map.locator('.leaflet-marker-pane .marker-cluster').filter({ visible: true }).first().click({ force: true })
      return zoomUntilAnyStationVisible()
    }
    return visibleStations[0]!
  }

  const visibleStation = await zoomUntilAnyStationVisible()
  await visibleStation.click()
  await expect(page).toHaveURL(/\/stations\/[a-zA-Z]+/)
  await expect(page.getByTestId('station-name')).toBeVisible()
})

test('has an about page', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('nav-link-/about').click()
  await expect(page).toHaveURL('/about')

  await expect(page.locator('main')).toHaveText(/Impressum/)
  await expect(page.getByTestId('repository-link')).toHaveAttribute('href', 'https://github.com/DerYeger/yeger/tree/main/apps/wiener-time')
})
