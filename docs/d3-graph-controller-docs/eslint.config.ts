import yeger from '@yeger/eslint-config'

export default yeger(
  {
    'rules': {
      'ts/consistent-type-imports': 'off',
      'ts/no-unused-vars': 'off',
      'no-console': 'off',
      'unused-imports/no-unused-vars': 'off',
    },
  },
)
