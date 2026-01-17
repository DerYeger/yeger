<script setup lang="ts">
import { useNotification } from '../composables/notifications'

const props = defineProps<{ content: string }>()
const emit = defineEmits(['copied'])
const { content } = toRefs(props)

const isClipboardSupported = typeof navigator !== 'undefined' && !!navigator.clipboard

const { info } = useNotification()

async function copyToClipboard() {
  await navigator.clipboard.writeText(content.value)
  info('Copied to clipboard', {
    closeButton: false,
    hideProgressBar: true,
    pauseOnFocusLoss: false,
    pauseOnHover: false,
    id: 'copied-to-clipboard',
    timeout: 1000,
  })
  emit('copied')
}
</script>

<template>
  <ClientOnly>
    <IconButton
      v-if="isClipboardSupported"
      name="carbon:copy"
      aria-label="Copy"
      class="text-stone-700"
      @click="copyToClipboard()"
    />
  </ClientOnly>
</template>
