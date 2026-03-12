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
</script>

<template>
  <UForm :state="state" :schema="UpdateBAVHistoryRequestSchema" @submit="onSubmit">
    <UCard class="w-fit" :ui="{ body: 'flex flex-col gap-4', footer: 'flex justify-end' }">
      <template #header>
        <h3>
          {{ state.year }}
        </h3>
      </template>
      <UFormField :label="$t('bav.form.contributions')">
        <UInputNumber
          v-model="state.contributions"
          :disabled="isLoading"
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
          :disabled="isLoading"
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
        <UButton type="submit" :disabled="isLoading">
          {{ $t('bav.form.submit') }}
        </UButton>
      </template>
    </UCard>
  </UForm>
</template>
