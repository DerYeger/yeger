<script setup lang="ts">
const model = defineModel<string>({
  required: true,
})

const namedModel = defineModel<string>('named-model', {
  required: true,
})

function onClick() {
  model.value = Date.now().toString()
  namedModel.value = model.value
}
</script>

<template>
  <div @click="onClick()">Sibling</div>
</template>
