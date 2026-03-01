import { generate } from '@babel/generator'
import { describe, test } from 'vitest'
import { babelParse } from 'vue/compiler-sfc'

import { removeStubbedComponentImports } from '../../src/plugin/removeStubbedComponentImports'
import type { Components } from '../../src/plugin/utils'

const TEST_COMPONENTS: Components = new Map([
  [
    'Child',
    {
      props: new Map([
        ['modelValue', 'unknown'],
        ['isActive', 'boolean'],
      ]),
      emits: new Set(['update:modelValue', 'click']),
    },
  ],
])

describe('removeStubbedComponentImports', () => {
  test('removes imports of stubbed components', ({ expect }) => {
    const input = 'import { Child } from "./components.ts"\nimport Sibling from "./Sibling.vue"'
    const ast = babelParse(input, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    })

    removeStubbedComponentImports(ast, TEST_COMPONENTS)

    const code = generate(ast).code
    expect(code).toBe('import Sibling from "./Sibling.vue";')
  })

  test('removes default imports of stubbed components', ({ expect }) => {
    const input = 'import Child from "./Child.vue"\nimport Sibling from "./Sibling.vue"'
    const ast = babelParse(input, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    })

    removeStubbedComponentImports(ast, TEST_COMPONENTS)

    const code = generate(ast).code
    expect(code).toBe('import Sibling from "./Sibling.vue";')
  })

  test('removes individual imports of stubbed components', ({ expect }) => {
    const input = 'import { Child, Sibling } from "./components.ts"\n'
    const ast = babelParse(input, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    })

    removeStubbedComponentImports(ast, TEST_COMPONENTS)

    const code = generate(ast).code
    expect(code).toBe('import { Sibling } from "./components.ts";')
  })

  test('removes aliased individual imports of stubbed components', ({ expect }) => {
    const input = 'import Main, { TrueChild as Child, Sibling } from "./components.ts"\n'
    const ast = babelParse(input, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    })

    removeStubbedComponentImports(ast, TEST_COMPONENTS)

    const code = generate(ast).code
    expect(code).toBe('import Main, { Sibling } from "./components.ts";')
  })

  test('removes namespace imports of stubbed components', ({ expect }) => {
    const input = 'import * as Components from "./components.ts"\n'
    const ast = babelParse(input, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    })

    removeStubbedComponentImports(ast, TEST_COMPONENTS)

    const code = generate(ast).code
    expect(code).toBe('import * as Components from "./components.ts";')
  })
})
