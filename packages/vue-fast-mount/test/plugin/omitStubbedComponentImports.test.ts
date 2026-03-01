import { describe, test } from 'vitest'

import { getComponentsFromTemplate } from '../../src/plugin/getComponentsFromTemplate'
import {
  omitStubbedComponentImports,
  parseImportClause,
  parseNamedSpecifiers,
  stringifyImportClause,
} from '../../src/plugin/omitStubbedComponentImports'

describe('omitStubbedComponentImports', () => {
  test('covers import collection and prune edge branches', ({ expect }) => {
    const scriptWithOnlyTypeAndSideEffect = `
  import type { Foo } from './types'
  import './side-effect'
  `
    const pruned = omitStubbedComponentImports(scriptWithOnlyTypeAndSideEffect, new Map())
    expect(pruned).toBe(scriptWithOnlyTypeAndSideEffect)

    const noTemplateBindings = omitStubbedComponentImports(
      `import Child from './Child.vue'`,
      new Map(),
    )
    expect(noTemplateBindings).toBe(`import Child from './Child.vue'`)

    const noImports = omitStubbedComponentImports(`const value = 1`, new Map())
    expect(noImports).toBe(`const value = 1`)

    const malformedImportNoClauseMatch = omitStubbedComponentImports(
      `import Broken\nconst a = 1`,
      new Map(),
    )
    expect(malformedImportNoClauseMatch).toBe(`import Broken\nconst a = 1`)

    const malformedImportInvalidClause = omitStubbedComponentImports(
      `import 123Invalid from './x'`,
      new Map(),
    )
    expect(malformedImportInvalidClause).toBe(`import 123Invalid from './x'`)
  })

  test('omits child imports for parent-like scripts with commented clauses', ({ expect }) => {
    const code = `<script setup lang="ts">
import { initialModelValue } from './allowedModule'
import Child from './Child.vue'
import { default as VElseIfChild } from './Child.vue'
import { default as VElseChild } from './Child.vue'
import {
  /** some comment */ BarrelChild as /** inline comment */ AliasedBarrelChild,
} from './barrel'
import MixedDefaultChild /** another comment */, {
  BarrelChild as MixedNamedChild,
} from './mixedBarrel'
import Sibling from './Sibling.vue'

const model = defineModel<string>({ default: initialModelValue })
</script>

<template>
  <div>
    <Child v-if="model === initialModelValue" />
    <VElseIfChild v-else-if="model === 'new-sibling-value'" />
    <VElseChild v-else />
    <AliasedBarrelChild />
    <MixedDefaultChild @child-event="model = $event" />
    <MixedNamedChild :child-prop="model" />
    <Sibling v-model="model" />
  </div>
</template>`

    const components = getComponentsFromTemplate(code, new Set(['MixedDefaultChild']))
    const scriptMatch = code.match(/<script\b[^>]*>([\s\S]*?)<\/script>/)
    const script = scriptMatch?.[1] ?? ''

    const transformed = omitStubbedComponentImports(script, components)

    expect(transformed).toMatchInlineSnapshot(`
      "
      import { h } from 'vue'

      import { initialModelValue } from './allowedModule'

      import MixedDefaultChild from './mixedBarrel'

      const model = defineModel<string>({ default: initialModelValue })

      const Child = {
        name: 'Child',
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

      const VElseIfChild = {
        name: 'VElseIfChild',
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
          return h('velse-if-child-stub', { ...normalizedAttrs, ...normalizedProps })
        }
      }

      const VElseChild = {
        name: 'VElseChild',
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
          return h('velse-child-stub', { ...normalizedAttrs, ...normalizedProps })
        }
      }

      const AliasedBarrelChild = {
        name: 'AliasedBarrelChild',
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
          return h('aliased-barrel-child-stub', { ...normalizedAttrs, ...normalizedProps })
        }
      }

      const MixedNamedChild = {
        name: 'MixedNamedChild',
        props: {
          'childProp': null
        },
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
          return h('mixed-named-child-stub', { ...normalizedAttrs, ...normalizedProps })
        }
      }

      const Sibling = {
        name: 'Sibling',
        props: {
          'modelValue': null
        },
        emits: ['update:modelValue'],
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
      }
      "
    `)
  })
})

describe('utils', () => {
  test('covers import clause parsing and stringifying branches', ({ expect }) => {
    expect(parseNamedSpecifiers('{ type Foo }')).toBeNull()
    expect(parseImportClause('123invalid')).toBeNull()

    const parsed = parseImportClause('DefaultComp, { Keep, Remove }')
    expect(parsed).toBeTruthy()
    expect(stringifyImportClause(parsed ?? [])).toBe('DefaultComp, { Keep, Remove }')
  })
})
