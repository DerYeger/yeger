<script setup lang="ts">
const { text } = defineProps<{
  text: string
}>()

const { copy } = useClipboard()

const toast = useToast()
function onClick() {
  copy(text)
  toast.add({
    id: 'copy-to-clipboard',
    title: $t('common.copy-toast'),
    color: 'success',
  })
}
</script>

<template>
  <UButton variant="ghost" color="neutral" class="text-muted" @click="onClick">{{ text }}</UButton>
</template>
