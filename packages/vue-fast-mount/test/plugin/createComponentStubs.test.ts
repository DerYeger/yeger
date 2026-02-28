import { describe, test } from 'vitest'

import { createComponentStubs } from '../../src/plugin/createComponentStubs'
import type { ComponentData } from '../../src/plugin/getComponentsFromTemplate'

describe('createComponentStubs', () => {
  test('does not create stub declaration if no components imports are present', ({ expect }) => {
    expect(createComponentStubs(new Map())).toBe(undefined)
  })

  test('creates stub declarations for components', ({ expect }) => {
    const components = new Map<string, ComponentData>([
      [
        'Child',
        {
          props: new Set(['modelValue', 'prop']),
          emits: new Set(['event', 'update:modelValue']),
        },
      ],
      ['Sibling', { props: new Set(['id', 'name']), emits: new Set(['close']) }],
    ])

    const stubsCode = createComponentStubs(components)

    expect(stubsCode).toMatchInlineSnapshot(`
      "const Child = {
        name: 'Child',
        props: ['modelValue', 'prop'],
        emits: ['event', 'update:modelValue'],
        render() {
          const normalizedAttrs = Object.fromEntries(Object.entries(this.$attrs).map(([key, value]) => [key.replace(/[A-Z]/g, (character) => '-' + character.toLowerCase()), value]))
          return h('child-stub', { ...normalizedAttrs, ...this.$props })
        }
      }

      const Sibling = {
        name: 'Sibling',
        props: ['id', 'name'],
        emits: ['close'],
        render() {
          const normalizedAttrs = Object.fromEntries(Object.entries(this.$attrs).map(([key, value]) => [key.replace(/[A-Z]/g, (character) => '-' + character.toLowerCase()), value]))
          return h('sibling-stub', { ...normalizedAttrs, ...this.$props })
        }
      }"
    `)
  })
})
