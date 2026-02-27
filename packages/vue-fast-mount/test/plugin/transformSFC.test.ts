import { describe, test } from 'vitest'

import {
  collectTopLevelImportStatements,
  createPlaceholderComponentDeclarations,
  ensureVueHImport,
  parseImportClause,
  parseNamedSpecifiers,
  pruneTemplateOnlyImportsInScriptSetup,
  stringifyImportClause,
  transformSFC,
} from '../../src/plugin/transformSFC'

describe('transformSFC', () => {
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

    const transformed = transformSFC(code, new Set<string>())

    expect(transformed).toContain("name: 'Child'")
    expect(transformed).toContain("name: 'AliasedBarrelChild'")
    expect(transformed).toContain("h('child-stub'")
    expect(transformed).toContain("h('aliased-barrel-child-stub'")
  })

  test('handles script and template early-return cases', ({ expect }) => {
    const noScriptSetup = `<template><div><Child /></div></template>`
    expect(transformSFC(noScriptSetup, new Set())).toBe(noScriptSetup)

    const noTemplateBindings = `
<script setup lang="ts">
import Child from './Child.vue'
</script>
<template><div><span>content</span></div></template>
`.trim()
    expect(transformSFC(noTemplateBindings, new Set())).toBe(noTemplateBindings)

    const noChangesDueToKeepBinding = `
<script setup lang="ts">
import Child from './Child.vue'
</script>
<template><div><Child /></div></template>
`.trim()
    expect(transformSFC(noChangesDueToKeepBinding, new Set(['Child']))).toBe(
      noChangesDueToKeepBinding,
    )
  })

  test('covers import clause parsing and stringifying branches', ({ expect }) => {
    expect(parseNamedSpecifiers('{ type Foo }')).toBeNull()
    expect(parseImportClause('123invalid')).toBeNull()

    const parsed = parseImportClause('DefaultComp, { Keep, Remove }')
    expect(parsed).toBeTruthy()
    expect(stringifyImportClause(parsed ?? [])).toBe('DefaultComp, { Keep, Remove }')
  })

  test('covers import collection and prune edge branches', ({ expect }) => {
    const scriptWithMultilineImport = `
import {
  Alpha,
  Beta,
} from './mod'
const local = 1
`
    const statements = collectTopLevelImportStatements(scriptWithMultilineImport)
    expect(statements).toHaveLength(1)
    expect(statements[0]?.statement).toContain('Alpha')

    const scriptWithOnlyTypeAndSideEffect = `
import type { Foo } from './types'
import './side-effect'
`
    const pruned = pruneTemplateOnlyImportsInScriptSetup(
      scriptWithOnlyTypeAndSideEffect,
      new Set(['Foo']),
      new Map(),
      new Set(),
    )
    expect(pruned).toBe(scriptWithOnlyTypeAndSideEffect)

    const noTemplateBindings = pruneTemplateOnlyImportsInScriptSetup(
      `import Child from './Child.vue'`,
      new Set(),
      new Map(),
      new Set(),
    )
    expect(noTemplateBindings).toBe(`import Child from './Child.vue'`)

    const noImports = pruneTemplateOnlyImportsInScriptSetup(
      `const value = 1`,
      new Set(['Child']),
      new Map(),
      new Set(),
    )
    expect(noImports).toBe(`const value = 1`)

    const malformedImportNoClauseMatch = pruneTemplateOnlyImportsInScriptSetup(
      `import Broken\nconst a = 1`,
      new Set(['Broken']),
      new Map(),
      new Set(),
    )
    expect(malformedImportNoClauseMatch).toBe(`import Broken\nconst a = 1`)

    const malformedImportInvalidClause = pruneTemplateOnlyImportsInScriptSetup(
      `import 123Invalid from './x'`,
      new Set(['Invalid']),
      new Map(),
      new Set(),
    )
    expect(malformedImportInvalidClause).toBe(`import 123Invalid from './x'`)
  })

  test('covers placeholder creation and h import retention', ({ expect }) => {
    expect(createPlaceholderComponentDeclarations([], new Map())).toBe('')

    const withHImport = `import { h } from 'vue'\nconst x = 1`
    expect(ensureVueHImport(withHImport)).toBe(withHImport)
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
