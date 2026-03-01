<script setup lang="ts">
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

defineProps<{
  name?: string
}>()

const model = defineModel<string>({ default: initialModelValue })
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
