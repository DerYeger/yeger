<script setup lang="ts">
import Child from './Child.vue'
import { BarrelChild as AliasedBarrelChild } from './barrel'
import MixedDefaultChild, { BarrelChild as MixedNamedChild } from './mixedBarrel'
import Sibling from './Sibling.vue'

defineProps<{
  name?: string
}>()

const model = defineModel<string>({ default: 'initial-sibling-value' })
</script>

<template>
  <div>
    <div>Parent</div>
    <Child />
    <AliasedBarrelChild data-testid="aliased-barrel-child" />
    <MixedDefaultChild />
    <MixedNamedChild />
    <Sibling v-model="model" />
  </div>
</template>
