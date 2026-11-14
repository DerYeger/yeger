import { defineConfig } from 'oxfmt'

export default defineConfig({
  semi: false,
  singleQuote: true,
  sortImports: {},
  sortPackageJson: {
    sortScripts: true,
  },
  ignorePatterns: ['docs/d3-graph-controller-docs/api/samples/*'],
  overrides: [
    {
      files: ['apps/alpvara/**/*.{ts,vue}'],
      options: {
        sortTailwindcss: {
          stylesheet: 'apps/alpvara/app/assets/css/main.css',
        },
      },
    },
    {
      files: ['apps/formi/**/*.{ts,vue}'],
      options: {
        sortTailwindcss: {
          stylesheet: 'apps/formi/app/assets/css/main.css',
        },
      },
    },
    {
      files: ['apps/wiener-time/**/*.{ts,tsx}'],
      options: {
        sortTailwindcss: {
          stylesheet: 'apps/wiener-time/src/styles/globals.css',
        },
      },
    },
    {
      files: ['packages/turbo-graph-ui/**/*.{ts,tsx}'],
      options: {
        sortTailwindcss: {
          stylesheet: 'packages/turbo-graph-ui/app/globals.css',
          functions: ['cn'],
        },
      },
    },
  ],
})
