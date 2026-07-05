<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const { icon = 'hugeicons:information-square', color = 'neutral' } = defineProps<{
  icon?: string
  color?: ButtonProps['color']
}>()

const isTooltipOpen = ref(false)

function openTooltip() {
  isTooltipOpen.value = true
}
</script>

<template>
  <div class="-m-2 shrink-0">
    <UPopover
      v-model:open="isTooltipOpen"
      mode="hover"
      arrow
      :ui="{
        content: 'whitespace-wrap flex w-fit max-w-[80dvw] flex-col gap-2 p-2 text-sm text-pretty',
      }"
    >
      <UButton :icon="icon" :color="color" variant="ghost" @click.stop="openTooltip()" />
      <template #content>
        <slot />
      </template>
    </UPopover>
  </div>
</template>
