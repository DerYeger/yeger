import yeger from '@yeger/eslint-config'

export default yeger(
  {
    ignores: ['next-env.d.ts'],
  },
  {
    rules: {
      'react-refresh/only-export-components': 'off',
      'unicorn/prefer-node-protocol': 'off',
  },
},
)
