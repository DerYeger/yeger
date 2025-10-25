import { coverage } from 'vite-plugin-lib'
import { mergeConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

import config from './vite.config'

export default mergeConfig(config, {
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
    coverage,
  },
})
