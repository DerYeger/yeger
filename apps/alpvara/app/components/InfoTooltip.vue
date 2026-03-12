<script setup lang="ts">
const { ui = { content: '' } } = defineProps<{
  ui?: {
    content?: string
  }
}>()
</script>

<template>
  <UPopover mode="hover">
    <UIcon name="hugeicons:information-square" class="col-start-2 size-6 shrink-0 text-muted" />
    <template #content>
      <div
        class="whitespace-wrap flex w-fit flex-col gap-2 p-2 text-center text-sm text-pretty"
        :class="{ [ui?.content ?? '']: true }"
      >
        <slot />
      </div>
    </template>
  </UPopover>
</template>
