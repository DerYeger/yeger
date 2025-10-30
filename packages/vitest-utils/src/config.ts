import process from 'node:process'
import type { TestUserConfig } from 'vitest/config'

export const configuration: Record<string, TestUserConfig> = {
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
    sequence: {
      shuffle: true,
    },
    unstubEnvs: true,
    unstubGlobals: true,
  },
}
