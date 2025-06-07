import { definePlaywrightConfig } from '@yeger/playwright-config'

export default definePlaywrightConfig({
  ports: {
    preview: 6173,
  },
})
