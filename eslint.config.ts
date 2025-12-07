import yeger from '@yeger/eslint-config'

export default yeger({
  rules: {
    'pnpm/json-enforce-catalog': 'off',
    'pnpm/yaml-enforce-settings': 'off',
    'pnpm/yaml-no-duplicate-catalog-item': 'off',
  },
}, {
  files: ['pnpm-workspace.yaml'],
  rules: {
    'yaml/sort-keys': 'off',
  },
})
