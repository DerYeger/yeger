<script setup lang="ts">
defineProps<{
  ui?: {
    content?: string
    icon?: string
  }
}>()
</script>

<template>
  <UPopover mode="hover">
    <UIcon
      name="hugeicons:information-square"
      class="size-6 shrink-0 text-muted"
      :class="{ [ui?.icon ?? '']: true }"
    />
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
