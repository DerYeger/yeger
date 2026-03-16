<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const { icon = 'hugeicons:information-square', color = 'neutral' } = defineProps<{
  icon?: string
  color?: ButtonProps['color']
  ui?: {
    content?: string
  }
}>()
</script>

<template>
  <div>
    <UPopover mode="click">
      <UButton :icon="icon" :color="color" variant="ghost" class="shrink-0" />
      <template #content>
        <div
          class="whitespace-wrap flex w-fit flex-col gap-2 p-2 text-center text-sm text-pretty"
          :class="{ [ui?.content ?? '']: true }"
        >
          <slot />
        </div>
      </template>
    </UPopover>
  </div>
</template>
