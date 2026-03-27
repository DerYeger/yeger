<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

const { portfolioId, account, history } = defineProps<{
  portfolioId: string
  account: BVAccount
  history: BVActivity[]
}>()

const state = reactive(getInitialStateFromAccountAndHistory())

function getInitialStateFromAccountAndHistory(): UpdateBVHistoryRequest {
  const lastActivity = history[0]
  const nextYearToFill = lastActivity
    ? new Date(lastActivity.datetime).getFullYear() + 1
    : new Date().getFullYear() - 1
  return {
    type: 'update',
    year: nextYearToFill,
    month: 1,
    contributions: 0,
    administrativeCosts: 0,
    socialSecurityFees: 0,
    performance: 0,
    lastQuote: account.quote.price,
    lastShares: account.position.shares,
  }
}

watch([() => account, () => history], () => {
  Object.assign(state, getInitialStateFromAccountAndHistory())
})

const { mutateAsync, isLoading } = useUpdateBVAccountHistory()

async function onSubmit(event: FormSubmitEvent<UpdateBVHistoryRequest>) {
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
  <UForm :state="state" :schema="UpdateBVHistoryRequestSchema" @submit="onSubmit">
    <UCard
      class="w-full max-w-full md:w-75"
      :ui="{
        header: 'flex items-center justify-between ga-2',
        body: 'flex flex-col gap-4',
        footer: 'flex justify-end',
      }"
    >
      <template #header>
        {{ state.year }}
        <span v-if="!canYearBeEdited" class="ml-auto text-muted">
          {{ $t('bv.form.current-year') }}
        </span>
      </template>
      <UFormField :label="$t('bv.form.contributions')">
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
      <UFormField :label="$t('bv.form.administrative-costs')">
        <UInputNumber
          v-model="state.administrativeCosts"
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
      <UFormField :label="$t('bv.form.social-security-fees')">
        <UInputNumber
          v-model="state.socialSecurityFees"
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
      <UFormField :label="$t('bv.form.performance')">
        <UInputNumber
          v-model="state.performance"
          :disabled="isLoading || !canYearBeEdited"
          :step="0.01"
          :format-options="{
            style: 'currency',
            currency: 'EUR',
            currencyDisplay: 'symbol',
          }"
        />
      </UFormField>
      <template #footer>
        <UButton
          type="submit"
          class="-my-1"
          variant="subtle"
          :color="canYearBeEdited ? 'primary' : 'neutral'"
          :disabled="isLoading || !canYearBeEdited"
        >
          {{ $t('bv.form.submit') }}
        </UButton>
      </template>
    </UCard>
  </UForm>
</template>
