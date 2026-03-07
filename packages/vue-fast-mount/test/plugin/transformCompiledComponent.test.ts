import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, test } from 'vitest'
import { compileScript, parse } from 'vue/compiler-sfc'

import { transformCompiledComponent } from '../../src/transformCompiledComponent'
import {
  FAST_MOUNT_UNSTUB_QUERY_KEY,
  FAST_MOUNT_QUERY_KEY,
  FAST_MOUNT_QUERY_VALUE,
} from '../../src/utils'

const TEST_SFC_PATH = resolve('test/runtime/Parent.vue')
const TEST_SFC_SOURCE = readFileSync(TEST_SFC_PATH, 'utf-8')

function compileParentScript(): string {
  const { descriptor } = parse(TEST_SFC_SOURCE, { filename: TEST_SFC_PATH })
  return compileScript(descriptor, { id: 'test-id' }).content
}

describe('transformCompiledComponent', () => {
  test('returns null for unmarked modules', ({ expect }) => {
    const code = compileParentScript()
    const id = `${TEST_SFC_PATH}?vue&type=script&setup=true&lang.ts`

    const result = transformCompiledComponent(code, id)

    expect(result).toBeNull()
  })

  test('returns null for non-script vue modules', ({ expect }) => {
    const code = 'export function render() {}'
    const id = `${TEST_SFC_PATH}?${FAST_MOUNT_QUERY_KEY}=${FAST_MOUNT_QUERY_VALUE}&vue&type=template&lang.ts`

    const result = transformCompiledComponent(code, id)

    expect(result).toBeNull()
  })

  test('rewrites compiled script imports into inferred stubs', ({ expect }) => {
    const code = compileParentScript()
    const id = `${TEST_SFC_PATH}?${FAST_MOUNT_QUERY_KEY}=${FAST_MOUNT_QUERY_VALUE}&vue&type=script&setup=true&lang.ts`

    const result = transformCompiledComponent(code, id)

    expect(result).not.toBeNull()
    expect(result!.code).not.toContain(`import Child from './Child.vue'`)
    expect(result!.code).not.toContain(`import Sibling from './Sibling.vue'`)
    expect(result!.code).toContain('const Child = {')
    expect(result!.code).toContain('const Sibling = {')
    expect(result!.code).toContain('emits: ["update:modelValue", "update:named-model"]')
    expect(result!.map).toMatchObject({
      version: 3,
      sources: [id],
    })
  })

  test('keeps configured unstubbed imports in compiled output', ({ expect }) => {
    const code = compileParentScript()
    const id = `${TEST_SFC_PATH}?${FAST_MOUNT_QUERY_KEY}=${FAST_MOUNT_QUERY_VALUE}&${FAST_MOUNT_UNSTUB_QUERY_KEY}=Sibling&vue&type=script&setup=true&lang.ts`

    const result = transformCompiledComponent(code, id)

    expect(result).not.toBeNull()
    expect(result!.code).toContain(`import Sibling from './Sibling.vue'`)
    expect(result!.code).not.toContain('const Sibling = {')
  })
})
