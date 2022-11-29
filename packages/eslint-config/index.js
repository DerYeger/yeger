module.exports = {
  extends: [
    '@antfu',
    'plugin:cypress/recommended',
    'plugin:import/recommended',
    'plugin:markdown/recommended',
    'plugin:md/recommended',
    'plugin:prettier/recommended',
    'plugin:yml/standard',
    'plugin:yml/prettier',
  ],
  plugins: ['eslint-plugin-tsdoc', 'unused-imports'],
  overrides: [
    {
      files: ['*.md'],
      parser: 'markdown-eslint-parser',
      rules: {
        'prettier/prettier': ['error', { parser: 'markdown' }],
      },
    },
    {
      files: ['*.yaml', '*.yml'],
      parser: 'yaml-eslint-parser',
    },
  ],
  rules: {
    '@typescript-eslint/brace-style': ['error', '1tbs'],
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'explicit',
        overrides: {
          accessors: 'explicit',
          constructors: 'explicit',
          parameterProperties: 'explicit',
        },
      },
    ],
    '@typescript-eslint/no-unused-vars': 'off',
    'brace-style': ['error', '1tbs'],
    'import/named': 'off',
    'import/no-unresolved': 'off',
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'md/remark': [
      'error',
      {
        plugins: ['frontmatter', ['lint-maximum-line-length', false]],
      },
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxEOF: 1,
      },
    ],
    'no-unused-vars': 'off',
    'prefer-template': 'error',
    'prefer-const': 'error',
    'tsdoc/syntax': 'error',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
}
