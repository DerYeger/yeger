<script setup lang="ts">
const model = defineModel<string>({
  required: true,
})
</script>

<template>
  <div @click="model = Date.now().toString()">Sibling</div>
</template>
