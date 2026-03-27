<script setup lang="ts">
const { loading, timestamp } = defineProps<{
  loading: boolean
  timestamp: string | undefined
}>()

const now = useNow()
const isFresh = computed(() => {
  if (!timestamp) {
    return true
  }
  const timestampDate = new Date(timestamp)
  const diffInMinutes = (now.value.getTime() - timestampDate.getTime()) / (1000 * 60)
  return diffInMinutes < 10
})

const isStale = computed(() => {
  if (!timestamp) {
    return false
  }
  const timestampDate = new Date(timestamp)
  const diffInDays = (now.value.getTime() - timestampDate.getTime()) / (1000 * 60 * 60 * 24)
  return diffInDays >= 1
})

const { locale, localeCodes } = useI18n()

const localizedTimeSinceRefresh = Object.fromEntries(
  localeCodes.value.map((code) => {
    return [code, useTimeAgoIntl(() => timestamp ?? Date.now(), { locale: code })]
  }),
)

const isDisabled = computed(() => !timestamp || isFresh.value)

const emit = defineEmits<{
  (event: 'refresh'): void
}>()
</script>

<template>
  <UTooltip arrow :disabled="!timestamp">
    <UChip :show="isStale" color="info">
      <UButton
        icon="hugeicons:reload"
        :color="isDisabled ? 'neutral' : 'secondary'"
        variant="subtle"
        :loading="loading"
        :disabled="isDisabled"
        @click.stop="emit('refresh')"
      >
        <div class="max-sm:hidden">
          {{ $t('common.refresh') }}
        </div>
      </UButton>
    </UChip>
    <template #content> {{ localizedTimeSinceRefresh[locale] }} </template>
  </UTooltip>
</template>
