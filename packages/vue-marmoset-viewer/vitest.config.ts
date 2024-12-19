import { coverage } from 'vite-plugin-lib'
import { mergeConfig } from 'vitest/config'

import config from './vite.config'

export default mergeConfig(config, {
  test: {
    environment: 'jsdom',
    coverage,
  },
})
