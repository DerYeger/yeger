import { describe, test } from 'vitest'

import { transformSFC } from '../../src/plugin/transformSFC'

describe('transformSFC', () => {
  test('transforms script setup imports into local stubs', ({ expect }) => {
    const code = `
<script setup lang="ts">
import Child from './Child.vue'
import { BarrelChild as AliasedBarrelChild } from './barrel'
</script>

<template>
  <div>
    <Child />
    <AliasedBarrelChild />
  </div>
</template>
`.trim()

    const transformed = transformSFC(code, new Set<string>())

    expect(transformed).toMatchInlineSnapshot(`
      "<script setup lang="ts">
      import { h } from 'vue'



      const Child = {
        name: 'Child',
        render() {
          const normalizedAttrs = Object.fromEntries(Object.entries(this.$attrs).map(([key, value]) => [key.replace(/[A-Z]/g, (character) => '-' + character.toLowerCase()), value]))
          return h('child-stub', { ...normalizedAttrs, ...this.$props })
        }
      }

      const AliasedBarrelChild = {
        name: 'AliasedBarrelChild',
        render() {
          const normalizedAttrs = Object.fromEntries(Object.entries(this.$attrs).map(([key, value]) => [key.replace(/[A-Z]/g, (character) => '-' + character.toLowerCase()), value]))
          return h('aliased-barrel-child-stub', { ...normalizedAttrs, ...this.$props })
        }
      }
      </script>

      <template>
        <div>
          <Child />
          <AliasedBarrelChild />
        </div>
      </template>"
    `)
  })

  test('handles missing script', ({ expect }) => {
    const noScriptSetup = `<template><div><Child /></div></template>`
    expect(transformSFC(noScriptSetup, new Set())).toBe(noScriptSetup)
  })

  test('handles missing template', ({ expect }) => {
    const noTemplate = `<script setup lang="ts">
import Child from './Child.vue'
</script>`
    expect(transformSFC(noTemplate, new Set())).toBe(noTemplate)
  })

  test('handles non-template usage case', ({ expect }) => {
    const noScriptSetup = `<template><div><Child /></div></template>`
    expect(transformSFC(noScriptSetup, new Set())).toBe(noScriptSetup)

    const noTemplateBindings = `
<script setup lang="ts">
import Child from './Child.vue'
const alsoUse = Child
</script>
<template><div><span>content</span></div></template>
`.trim()
    expect(transformSFC(noTemplateBindings, new Set())).toBe(noTemplateBindings)
  })

  test('handles explicit unstub case', ({ expect }) => {
    const noChangesDueToExplicitUnstub = `
<script setup lang="ts">
import Child from './Child.vue'
</script>
<template><div><Child /></div></template>
`.trim()
    expect(transformSFC(noChangesDueToExplicitUnstub, new Set(['Child']))).toBe(
      noChangesDueToExplicitUnstub,
    )
  })

  test('keeps partially-used imports and emits rewritten import clauses', ({ expect }) => {
    const code = `
<script setup lang="ts">
import DefaultComp, { Keep, Remove } from './items'
import { h } from 'vue'
const runtimeKeep = Keep
</script>
<template>
  <div>
    <Remove />
  </div>
</template>
`.trim()

    const transformed = transformSFC(code, new Set<string>())
    expect(transformed).toContain("import DefaultComp, { Keep } from './items'")
    expect(transformed).toContain('const Remove = {')
    expect(transformed).toContain("name: 'Remove'")
    expect(transformed).toContain("h('remove-stub'")
  })

  test('keeps imports when local is used or excluded by keepBindings', ({ expect }) => {
    const usedInScript = `
<script setup lang="ts">
import Child from './Child.vue'
const alsoUse = Child
</script>
<template><div><Child /></div></template>
`.trim()
    expect(transformSFC(usedInScript, new Set())).toBe(usedInScript)

    const keptByBinding = `
<script setup lang="ts">
import Child from './Child.vue'
</script>
<template><div><Child /></div></template>
`.trim()
    expect(transformSFC(keptByBinding, new Set(['Child']))).toBe(keptByBinding)
  })

  test('transforms conditional chain components even with comments between imports', ({
    expect,
  }) => {
    const code = `
<script setup lang="ts">
import Child from './Child.vue'

// else-if and else branches
import { default as VElseIfChild } from './Child.vue'
/* else branch */
import { default as VElseChild } from './Child.vue'
</script>
<template>
  <div>
    <Child v-if="true" />
    <VElseIfChild v-else-if="false" />
    <VElseChild v-else />
  </div>
</template>
`.trim()

    const transformed = transformSFC(code, new Set<string>())

    expect(transformed).not.toContain("import Child from './Child.vue'")
    expect(transformed).not.toContain("import { default as VElseIfChild } from './Child.vue'")
    expect(transformed).not.toContain("import { default as VElseChild } from './Child.vue'")
    expect(transformed).toContain("name: 'Child'")
    expect(transformed).toContain("name: 'VElseIfChild'")
    expect(transformed).toContain("name: 'VElseChild'")
  })
})
