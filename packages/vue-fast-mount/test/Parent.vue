<script setup lang="ts">
import Child from './Child.vue'
import { default as VElseIfChild } from './Child.vue'
import { default as VElseChild } from './Child.vue'
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
    <Child v-if="model === 'initial-sibling-value'" />
    <VElseIfChild v-else-if="model === 'new-sibling-value'" data-testid="v-else-if" />
    <VElseChild v-else data-testid="v-else" />
    <AliasedBarrelChild data-testid="aliased-barrel-child" />
    <MixedDefaultChild @child-event="model = $event" />
    <MixedNamedChild :child-prop="model" />
    <Sibling v-model="model" />
  </div>
</template>
