<script setup lang="ts">
const props = defineProps<{ content: string }>()
const emit = defineEmits(['copied'])
const { content } = toRefs(props)

const isClipboardSupported =
  typeof navigator !== 'undefined' && !!navigator.clipboard

async function copyToClipboard() {
  await navigator.clipboard.writeText(content.value)
  emit('copied')
}
</script>

<template>
  <ClientOnly>
    <IconButton
      v-if="isClipboardSupported"
      name="carbon:copy"
      class="text-stone-700"
      @click="copyToClipboard()"
    />
  </ClientOnly>
</template>
