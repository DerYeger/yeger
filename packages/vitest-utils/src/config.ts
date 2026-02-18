import process from 'node:process'

import deepmerge from 'deepmerge'
import type { TestUserConfig } from 'vitest/config'
import type { BrowserProviderOption } from 'vitest/node'

export const configuration: Record<string, TestUserConfig> = {
  common: {
    silent: 'passed-only',
  },
  coverage: {
    coverage: {
      enabled: !!process.env.COVERAGE,
      include: ['src/**/*.*'],
      exclude: ['*.d.ts', '*.ohm', '.gitignore'],
      provider: 'v8' as const,
    },
  },
  idempotent: {
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
  },
}

export interface ConfigurationOptions {
  /**
   * Enables common configuration options. Default: `true`
   */
  common?: boolean
  /**
   * Enable coverage configuration. Default: `true`
   */
  coverage?: boolean
  /**
   * Enable idempotent configuration. Default: `true`
   */
  idempotent?: boolean
  /**
   * Specify the browser provider option. If defined, the browser mode will be auto-configured.
   */
  browser?: BrowserProviderOption
}

/**
 * Define a Vitest test configuration with coverage, idempotent settings, and browser support.
 */
export function defineTestConfig(
  { common = true, coverage = true, idempotent = true, browser }: ConfigurationOptions = {},
  userConfig: TestUserConfig = {},
): TestUserConfig {
  const config: TestUserConfig = {}

  if (common) {
    Object.assign(config, configuration.common)
  }

  if (coverage) {
    Object.assign(config, configuration.coverage)
  }

  if (idempotent) {
    Object.assign(config, configuration.idempotent)
  }

  if (browser) {
    config.browser = {
      enabled: true,
      provider: browser,
      instances: [{ browser: 'chromium' }],
    }
  }

  return deepmerge(config, userConfig) as TestUserConfig
}
