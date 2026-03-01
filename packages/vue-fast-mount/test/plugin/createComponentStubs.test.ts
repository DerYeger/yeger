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
          booleanShorthandProps: new Set(),
        },
      ],
      [
        'Sibling',
        {
          props: new Set(['id', 'name']),
          emits: new Set(['close']),
          booleanShorthandProps: new Set(),
        },
      ],
    ])

    const stubsCode = createComponentStubs(components)

    expect(stubsCode).toMatchInlineSnapshot(`
      "const Child = {
        name: 'Child',
        props: {
          'modelValue': null, 
          'prop': null
        },
        emits: ['event', 'update:modelValue'],
        render() {
          const normalizedAttrs = Object.fromEntries(Object.entries(this.$attrs).map(([key, value]) => [key.replace(/[A-Z]/g, (character) => '-' + character.toLowerCase()), value]))

          const booleanShorthandProps = new Set([])
          const vnodeProps = ((this as { $?: { vnode?: { props?: Record<string, unknown> } } }).$?.vnode?.props ?? {}) as Record<string, unknown>
          const normalizedProps = Object.fromEntries(Object.entries(this.$props).map(([key, value]) => {
            const camelKey = key.replace(/-([a-zA-Z])/g, (_, character) => character.toUpperCase())
            const kebabKey = key.replace(/[A-Z]/g, (character) => '-' + character.toLowerCase())
            const hasShorthandMetadata = booleanShorthandProps.has(key) || booleanShorthandProps.has(camelKey)
            const hasEmptyVNodeProp = vnodeProps[key] === '' || vnodeProps[camelKey] === '' || vnodeProps[kebabKey] === ''
            const isShorthandBoolean = hasShorthandMetadata || hasEmptyVNodeProp
            return [key, value === '' && isShorthandBoolean ? true : value]
          }))
          return h('child-stub', { ...normalizedAttrs, ...normalizedProps })
        }
      }

      const Sibling = {
        name: 'Sibling',
        props: {
          'id': null, 
          'name': null
        },
        emits: ['close'],
        render() {
          const normalizedAttrs = Object.fromEntries(Object.entries(this.$attrs).map(([key, value]) => [key.replace(/[A-Z]/g, (character) => '-' + character.toLowerCase()), value]))

          const booleanShorthandProps = new Set([])
          const vnodeProps = ((this as { $?: { vnode?: { props?: Record<string, unknown> } } }).$?.vnode?.props ?? {}) as Record<string, unknown>
          const normalizedProps = Object.fromEntries(Object.entries(this.$props).map(([key, value]) => {
            const camelKey = key.replace(/-([a-zA-Z])/g, (_, character) => character.toUpperCase())
            const kebabKey = key.replace(/[A-Z]/g, (character) => '-' + character.toLowerCase())
            const hasShorthandMetadata = booleanShorthandProps.has(key) || booleanShorthandProps.has(camelKey)
            const hasEmptyVNodeProp = vnodeProps[key] === '' || vnodeProps[camelKey] === '' || vnodeProps[kebabKey] === ''
            const isShorthandBoolean = hasShorthandMetadata || hasEmptyVNodeProp
            return [key, value === '' && isShorthandBoolean ? true : value]
          }))
          return h('sibling-stub', { ...normalizedAttrs, ...normalizedProps })
        }
      }"
    `)
  })
})
