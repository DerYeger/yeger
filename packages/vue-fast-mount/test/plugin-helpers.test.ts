import { describe, test } from 'vitest'

import {
  getKeepBindingsFromId,
  internalPluginHelpers,
  rewriteFastMountCallsites,
  shouldTransformVueFastMountId,
  transformFastMountVueSource,
} from '../src/plugin-helpers'

describe('plugin helpers', () => {
  test('rewrites fastMount callsites and forwards keep bindings', ({ expect }) => {
    const code = [
      `import { fastMount as fm } from 'vue-fast-mount'`,
      `await fm(import('./Parent.vue'), { global: { stubs: { Sibling: false } } })`,
    ].join('\n')

    const transformed = rewriteFastMountCallsites(code)

    expect(transformed).toContain('./Parent.vue?__vfm=1&__vfm_keep=Sibling')
  })

  test('transforms script setup imports into local placeholder stubs', ({ expect }) => {
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

    const transformed = transformFastMountVueSource(code, new Set<string>())

    expect(transformed).toContain("name: 'Child'")
    expect(transformed).toContain("name: 'AliasedBarrelChild'")
    expect(transformed).toContain("h('child-stub'")
    expect(transformed).toContain("h('aliased-barrel-child-stub'")
  })

  test('detects transform ids and reads keep bindings from query', ({ expect }) => {
    expect(shouldTransformVueFastMountId('/tmp/Parent.vue?__vfm=1')).toBe(true)
    expect(shouldTransformVueFastMountId('/tmp/Parent.vue?__vfm=1&type=template')).toBe(false)
    expect(shouldTransformVueFastMountId('/tmp/Parent.vue?foo=bar')).toBe(false)
    expect(shouldTransformVueFastMountId('/tmp/Parent.vue')).toBe(false)
    expect(shouldTransformVueFastMountId('/tmp/Parent.ts?__vfm=1')).toBe(false)

    expect(
      [...getKeepBindingsFromId('/tmp/Parent.vue?__vfm=1&__vfm_keep=Sibling,Child')].sort(),
    ).toStrictEqual(['Child', 'Sibling'])
    expect(getKeepBindingsFromId('/tmp/Parent.vue')).toStrictEqual(new Set())
    expect(getKeepBindingsFromId('/tmp/Parent.vue?__vfm=1')).toStrictEqual(new Set())
  })

  test('handles script and template early-return cases', ({ expect }) => {
    const noScriptSetup = `<template><div><Child /></div></template>`
    expect(transformFastMountVueSource(noScriptSetup, new Set())).toBe(noScriptSetup)

    const noTemplateBindings = `
<script setup lang="ts">
import Child from './Child.vue'
</script>
<template><div><span>content</span></div></template>
`.trim()
    expect(transformFastMountVueSource(noTemplateBindings, new Set())).toBe(noTemplateBindings)

    const noChangesDueToKeepBinding = `
<script setup lang="ts">
import Child from './Child.vue'
</script>
<template><div><Child /></div></template>
`.trim()
    expect(transformFastMountVueSource(noChangesDueToKeepBinding, new Set(['Child']))).toBe(
      noChangesDueToKeepBinding,
    )
  })

  test('covers import clause parsing and stringifying branches', ({ expect }) => {
    expect(internalPluginHelpers.parseNamedSpecifiers('{ type Foo }')).toBeNull()
    expect(internalPluginHelpers.parseImportClause('123invalid')).toBeNull()

    const parsed = internalPluginHelpers.parseImportClause('DefaultComp, { Keep, Remove }')
    expect(parsed).toBeTruthy()
    expect(internalPluginHelpers.stringifyImportClause(parsed ?? [])).toBe(
      'DefaultComp, { Keep, Remove }',
    )
  })

  test('covers import collection and prune edge branches', ({ expect }) => {
    const scriptWithMultilineImport = `
import {
  Alpha,
  Beta,
} from './mod'
const local = 1
`
    const statements =
      internalPluginHelpers.collectTopLevelImportStatements(scriptWithMultilineImport)
    expect(statements).toHaveLength(1)
    expect(statements[0]?.statement).toContain('Alpha')

    const scriptWithOnlyTypeAndSideEffect = `
import type { Foo } from './types'
import './side-effect'
`
    const pruned = internalPluginHelpers.pruneTemplateOnlyImportsInScriptSetup(
      scriptWithOnlyTypeAndSideEffect,
      new Set(['Foo']),
      new Map(),
      new Set(),
    )
    expect(pruned).toBe(scriptWithOnlyTypeAndSideEffect)

    const noTemplateBindings = internalPluginHelpers.pruneTemplateOnlyImportsInScriptSetup(
      `import Child from './Child.vue'`,
      new Set(),
      new Map(),
      new Set(),
    )
    expect(noTemplateBindings).toBe(`import Child from './Child.vue'`)

    const noImports = internalPluginHelpers.pruneTemplateOnlyImportsInScriptSetup(
      `const value = 1`,
      new Set(['Child']),
      new Map(),
      new Set(),
    )
    expect(noImports).toBe(`const value = 1`)

    const malformedImportNoClauseMatch =
      internalPluginHelpers.pruneTemplateOnlyImportsInScriptSetup(
        `import Broken\nconst a = 1`,
        new Set(['Broken']),
        new Map(),
        new Set(),
      )
    expect(malformedImportNoClauseMatch).toBe(`import Broken\nconst a = 1`)

    const malformedImportInvalidClause =
      internalPluginHelpers.pruneTemplateOnlyImportsInScriptSetup(
        `import 123Invalid from './x'`,
        new Set(['Invalid']),
        new Map(),
        new Set(),
      )
    expect(malformedImportInvalidClause).toBe(`import 123Invalid from './x'`)
  })

  test('covers placeholder creation and h import retention', ({ expect }) => {
    expect(internalPluginHelpers.createPlaceholderComponentDeclarations([], new Map())).toBe('')

    const withHImport = `import { h } from 'vue'\nconst x = 1`
    expect(internalPluginHelpers.ensureVueHImport(withHImport)).toBe(withHImport)
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

    const transformed = transformFastMountVueSource(code, new Set<string>())
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
    expect(transformFastMountVueSource(usedInScript, new Set())).toBe(usedInScript)

    const keptByBinding = `
<script setup lang="ts">
import Child from './Child.vue'
</script>
<template><div><Child /></div></template>
`.trim()
    expect(transformFastMountVueSource(keptByBinding, new Set(['Child']))).toBe(keptByBinding)
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

    const transformed = transformFastMountVueSource(code, new Set<string>())

    expect(transformed).not.toContain("import Child from './Child.vue'")
    expect(transformed).not.toContain("import { default as VElseIfChild } from './Child.vue'")
    expect(transformed).not.toContain("import { default as VElseChild } from './Child.vue'")
    expect(transformed).toContain("name: 'Child'")
    expect(transformed).toContain("name: 'VElseIfChild'")
    expect(transformed).toContain("name: 'VElseChild'")
  })
})
