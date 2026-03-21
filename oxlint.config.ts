import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: [
    'eslint',
    'typescript',
    'unicorn',
    'react',
    'react-perf',
    'nextjs',
    'oxc',
    'import',
    'jsdoc',
    'jsx-a11y',
    'node',
    'promise',
    'vitest',
    'vue',
  ],
  categories: {
    correctness: 'error',
  },
  rules: {
    'consistent-type-imports': 'error',
    'no-console': 'error',
    'no-unassigned-import': 'off',
    'react-in-jsx-scope': 'off',
    'require-await': 'error',
    'valid-expect': 'off',
  },
  options: {
    typeAware: true,
  },
  settings: {
    jsdoc: {
      tagNamePreference: {
        defaultValue: 'defaultValue',
        remarks: 'remarks',
      },
    },
  },
  overrides: [
    {
      files: ['apps/wiener-time/scripts/generate-stations.ts', 'apps/wiener-time/src/env/*'],
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: ['docs/d3-graph-controller-docs/**/samples/**/*.ts'],
      rules: {
        'consistent-type-imports': 'off',
        'no-console': 'off',
        'no-unassigned-import': 'off',
        'no-unsafe-type-assertion': 'off',
        'no-unused-vars': 'off',
      },
    },
  ],
})
