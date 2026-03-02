import { readFileSync } from 'node:fs'

import { describe, test } from 'vitest'

import { transformSFC } from '../../src/transformSFC'
import {
  FAST_MOUNT_UNSTUB_QUERY_KEY,
  FAST_MOUNT_QUERY_KEY,
  FAST_MOUNT_QUERY_VALUE,
} from '../../src/utils'

const TEST_SFC = readFileSync('test/runtime/Parent.vue', 'utf-8')

const TEST_ID = `Test.vue?${FAST_MOUNT_QUERY_KEY}=${FAST_MOUNT_QUERY_VALUE}`

describe('transformSFC', () => {
  test('does not transform unmarked files', ({ expect }) => {
    const result = transformSFC(TEST_SFC, 'Test.vue')
    expect(result).toBeNull()
  })

  test('does not transform files without a temlate', ({ expect }) => {
    const sfcWithoutScript = `
      <script setup lang="ts">
      import Child from './Child.vue'
      </script>
    `
    const result = transformSFC(sfcWithoutScript, TEST_ID)
    expect(result).toBeNull()
  })

  test('does not transform files without a script', ({ expect }) => {
    const sfcWithoutScript = `
      <template>
        <Child>Test</Child>
      </template>
    `
    const result = transformSFC(sfcWithoutScript, TEST_ID)
    expect(result).toBeNull()
  })

  test('ignores components that are marked as unstubbed', ({ expect }) => {
    const sfcWithScriptUsage = `
     <script setup lang="ts">
      import Child from './Child.vue'
      console.log(Child)
      </script>

      <template>
        <Child>Test</Child>
      </template>
    `
    const result = transformSFC(
      sfcWithScriptUsage,
      `${TEST_ID}&${FAST_MOUNT_UNSTUB_QUERY_KEY}=Child`,
    )
    expect(result).toBeNull()
  })

  test('omits components that are only used in the template', ({ expect }) => {
    const sfcWithScriptUsage = `
<script setup lang="ts">
import Child from './Child.vue'
</script>

<template>
  <Child>Test</Child>
</template>
    `
    const result = transformSFC(sfcWithScriptUsage, TEST_ID)
    expect(result?.code).toBe(`
<script setup lang="ts">
const Child = {
  name: "Child"
};
</script>

<template>
  <Child>Test</Child>
</template>
    `)
  })

  test('transforms Parent.vue as expected', ({ expect }) => {
    const output = transformSFC(TEST_SFC, TEST_ID)
    expect(output?.code).toMatchInlineSnapshot(`
      "<script setup lang="ts">
      import { initialModelValue } from './allowedModule';
      defineProps<{
        name?: string;
      }>();
      const model = defineModel<string>({
        default: initialModelValue
      });
      const Child = {
        name: "Child"
      };
      const VElseIfChild = {
        name: "VElseIfChild",
        props: {}
      };
      const VElseChild = {
        name: "VElseChild",
        props: {}
      };
      const AliasedBarrelChild = {
        name: "AliasedBarrelChild",
        props: {
          "is-active": Boolean
        }
      };
      const MixedDefaultChild = {
        name: "MixedDefaultChild",
        emits: ["child-event"]
      };
      const MixedNamedChild = {
        name: "MixedNamedChild",
        props: {
          "child-prop": null
        }
      };
      const Sibling = {
        name: "Sibling",
        props: {
          "modelValue": null,
          "named-model": null
        },
        emits: ["update:modelValue", "update:named-model"]
      };
      </script>

      <template>
        <div>
          <div>Parent</div>
          <Child v-if="model === initialModelValue" />
          <VElseIfChild v-else-if="model === 'new-sibling-value'" data-testid="v-else-if" />
          <VElseChild v-else data-testid="v-else" />
          <Child> default-slot </Child>
          <Child>
            <template #named> named-slot </template>
          </Child>
          <AliasedBarrelChild data-testid="aliased-barrel-child" is-active />
          <MixedDefaultChild @child-event="model = $event" />
          <MixedNamedChild :child-prop="model" />
          <Sibling v-model="model" v-model:named-model="model" />
        </div>
      </template>
      "
    `)
  })
})
