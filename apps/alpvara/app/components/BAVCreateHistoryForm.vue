<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

const { portfolioId, accountId } = defineProps<{
  portfolioId: string
  accountId: string
}>()

const LAST_YEAR = new Date().getFullYear() - 1

const state = reactive({
  type: 'create',
  year: LAST_YEAR,
  contributions: 0,
  finalBalance: 0,
} satisfies CreateBAVHistoryRequest)

const { mutateAsync, isLoading } = useCreateBAVAccountHistory()

async function onSubmit(event: FormSubmitEvent<CreateBAVHistoryRequest>) {
  try {
    await mutateAsync({
      ...event.data,
      portfolioId,
      accountId,
    })
  } catch (_) {}
}
</script>

<template>
  <UForm :state="state" :schema="CreateBAVHistoryRequestSchema" @submit="onSubmit">
    <UCard class="w-fit" :ui="{ body: 'flex flex-col gap-4', footer: 'flex justify-end' }">
      <template #header>
        {{ $t('bav.form.first-year') }}
      </template>
      <UFormField :label="$t('bav.form.year')">
        <UInputNumber
          v-model="state.year"
          :disabled="isLoading"
          :max="LAST_YEAR"
          :step="1"
          :format-options="{
            useGrouping: false,
          }"
        />
      </UFormField>
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
