<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

const { portfolioId, account, history } = defineProps<{
  portfolioId: string
  account: BAVAccount
  history: BAVActivity[]
}>()

const state = reactive(getInitialStateFromAccountAndHistory())

function getInitialStateFromAccountAndHistory(): UpdateBAVHistoryRequest {
  const lastActivity = history[0]
  const nextYearToFill = lastActivity
    ? new Date(lastActivity.datetime).getFullYear() + 1
    : new Date().getFullYear() - 1
  return {
    type: 'update',
    year: nextYearToFill,
    contributions: 0,
    finalBalance: 0,
    lastQuote: account.quote.price,
    lastShares: account.position.shares,
  }
}

watch([() => account, () => history], () => {
  Object.assign(state, getInitialStateFromAccountAndHistory())
})

const { mutateAsync, isLoading } = useUpdateBAVAccountHistory()

async function onSubmit(event: FormSubmitEvent<UpdateBAVHistoryRequest>) {
  try {
    await mutateAsync({
      ...event.data,
      portfolioId,
      accountId: account.id,
    })
  } catch (_) {}
}

const canYearBeEdited = computed(() => {
  const currentYear = new Date().getFullYear()
  return state.year < currentYear
})
</script>

<template>
  <UForm :state="state" :schema="UpdateBAVHistoryRequestSchema" @submit="onSubmit">
    <UCard
      class="w-fit"
      :ui="{
        header: 'flex items-center justify-between ga-2',
        body: 'flex flex-col gap-4',
        footer: 'flex justify-end',
      }"
    >
      <template #header>
        {{ state.year }}
        <span v-if="!canYearBeEdited" class="ml-auto text-muted">
          {{ $t('bav.form.current-year') }}
        </span>
      </template>
      <UFormField :label="$t('bav.form.contributions')">
        <UInputNumber
          v-model="state.contributions"
          :disabled="isLoading || !canYearBeEdited"
          :min="0"
          :step="0.01"
          :format-options="{
            style: 'currency',
            currency: 'EUR',
            currencyDisplay: 'symbol',
          }"
        />
      </UFormField>
      <UFormField :label="$t('bav.form.final-balance')">
        <UInputNumber
          v-model="state.finalBalance"
          :disabled="isLoading || !canYearBeEdited"
          :min="0"
          :step="0.01"
          :format-options="{
            style: 'currency',
            currency: 'EUR',
            currencyDisplay: 'symbol',
          }"
        />
      </UFormField>
      <template #footer>
        <UButton type="submit" :disabled="isLoading || !canYearBeEdited">
          {{ $t('bav.form.submit') }}
        </UButton>
      </template>
    </UCard>
  </UForm>
</template>
