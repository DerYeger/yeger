import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import antfu from '@antfu/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'
import astroParser from 'astro-eslint-parser'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default function (...configs) {
  const compat = new FlatCompat({ resolvePluginsRelativeTo: __dirname })
  return antfu(
    {
      markdown: true,
      react: true,
      stylistic: {
        indent: 2,
        quotes: 'single',
      },
      typescript: true,
      vue: true,
      yaml: true,
    },
    compat.extends(
      'plugin:astro/recommended',
      'plugin:cypress/recommended',
      'plugin:md/recommended',
      'plugin:tailwindcss/recommended',
      'plugin:yml/standard',
    ),
    compat.plugins('jsx-a11y', 'md', 'tailwindcss', 'tsdoc'),
    {
      ignores: ['**/vite.config.ts.*'],
    },
    {
      rules: {
        curly: ['error', 'all'],
        'style/brace-style': ['error', '1tbs'],
        'ts/brace-style': ['error', '1tbs'],
        'ts/explicit-member-accessibility': [
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
        'ts/no-unused-vars': 'off',
        'brace-style': ['error', '1tbs'],
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
        'test/prefer-lowercase-title': 'off',
        'jsdoc/check-param-names': 'off',
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
        'style/arrow-parens': ['error', 'always'],
        'style/operator-linebreak': 'off',
        'style/quote-props': 'off',
        'tailwindcss/enforces-shorthand': 'error',
        'tailwindcss/no-custom-classname': 'off',
        'tsdoc/syntax': 'error',
        // The following unicorn rules are disabled due to implementation issues
        'unicorn/error-message': 'off',
        'unicorn/no-instanceof-array': 'off',
        'unicorn/prefer-includes': 'off',
        'unicorn/prefer-number-properties': 'off',
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
        'yml/quotes': ['error', { prefer: 'single' }],
      },
    },
    {
      files: ['**/*.cjs', '**/*.js', '**/*.jsx', '**/*.mjs'],
      rules: {
        'tsdoc/syntax': 'off',
        'tsdoc-escape-right-brace': 'off',
        'tsdoc-malformed-inline-tag': 'off',
        'tsdoc-undefined-tag': 'off',
      },
    },
    {
      files: ['**/*.md'],
      rules: {
        'no-unused-vars': 'off',
        'tsdoc/syntax': 'off',
        'unused-imports/no-unused-imports': 'off',
      },
    },
    {
      files: ['**/*.astro'],
      languageOptions: {
        parser: astroParser,
        parserOptions: {
          parser: '@typescript-eslint/parser',
          extraFileExtensions: ['.astro'],
        },
      },
      rules: {
        'unused-imports/no-unused-vars': 'off',
      },
    },
    {
      files: ['**/*.bench.ts'],
      rules: {
        'test/consistent-test-it': 'off',
      },
    },
    ...configs,
  )
}
