import { defineConfig } from 'taze'

export default defineConfig({
  exclude: ['@vue/test-utils', 'vue'],
  force: true,
  includeLocked: true,
  install: true,
  maturityPeriod: 2,
  recursive: true,
  write: true,
})
