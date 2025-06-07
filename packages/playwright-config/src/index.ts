import process from 'node:process'

import { defineConfig, devices } from '@playwright/test'

export interface Options {
  ports?: {
    dev?: number
    preview?: number
  }
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export function definePlaywrightConfig({ ports = {} }: Options) {
  const isCI = !!process.env.CI
  const devPort = ports.dev ?? 4173
  const previewPort = ports.preview ?? 5173
  const port = isCI ? previewPort : devPort
  const baseURL = `http://localhost:${port}`
  return defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: isCI,
    retries: isCI ? 2 : 0,
    workers: isCI ? 1 : '50%',
    reporter: 'html',
    use: {
      baseURL,
      trace: 'on-first-retry',
    },
    projects: [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
      },
    ],
    webServer: {
      command: `nr ${isCI ? 'preview' : 'dev'} --port=${port}`,
      url: baseURL,
      reuseExistingServer: !isCI,
    },
  })
}
