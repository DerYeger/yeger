import { definePlaywrightConfig } from '@yeger/playwright-config'

export default definePlaywrightConfig({
  ports: {
    flag: '--listen',
    preview: 6173,
  },
})
