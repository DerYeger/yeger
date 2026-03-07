import generate from '@babel/generator'
import { describe, test } from 'vitest'
import { babelParse } from 'vue/compiler-sfc'

import { insertComponentStubs } from '../../src/insertComponentStubs'
import type { Components } from '../../src/utils'

const TEST_COMPONENTS: Components = new Map([
  [
    'Child',
    {
      props: new Map([
        ['modelValue', 'unknown'],
        ['isActive', 'boolean'],
        // Non-props
        ['is', 'unknown'],
        ['ref', 'unknown'],
        ['key', 'unknown'],
        ['data-test', 'unknown'],
        ['aria-label', 'unknown'],
      ]),
      emits: new Set(['update:modelValue', 'click']),
    },
  ],
])

describe('insertComponentStubs', () => {
  test('generates stub declarations for components', ({ expect }) => {
    const ast = babelParse('const test = 1', {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    })

    insertComponentStubs(ast, TEST_COMPONENTS)

    const code = generate(ast).code
    expect(code).toMatchInlineSnapshot(`
      "const Child = {
        name: "Child",
        props: {
          "modelValue": null,
          "isActive": Boolean
        },
        emits: ["update:modelValue", "click"]
      };
      const test = 1;"
    `)
  })
})
