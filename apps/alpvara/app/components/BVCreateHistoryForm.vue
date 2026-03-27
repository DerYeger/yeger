<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'
import type { FormSubmitEvent } from '@nuxt/ui'

const { portfolioId, accountId } = defineProps<{
  portfolioId: string
  accountId: string
}>()

const LAST_YEAR = new Date().getFullYear() - 1

const state = reactive({
  type: 'create',
  year: LAST_YEAR,
  month: 1,
  contributions: 0,
  administrativeCosts: 0,
  socialSecurityFees: 0,
  performance: 0,
} satisfies CreateBVHistoryRequest)

const { mutateAsync, isLoading } = useCreateBVAccountHistory()

async function onSubmit(event: FormSubmitEvent<CreateBVHistoryRequest>) {
  try {
    await mutateAsync({
      ...event.data,
      portfolioId,
      accountId,
    })
  } catch (_) {}
}

const MAX_CALENDAR_VALUE = new CalendarDate(LAST_YEAR, 12, 28)

const calendarModel = computed<CalendarDate>({
  get() {
    return new CalendarDate(state.year, state.month, 1)
  },
  set(date: CalendarDate) {
    state.year = Math.min(date.year, LAST_YEAR)
    state.month = date.month
  },
})
</script>

<template>
  <UForm :state="state" :schema="CreateBVHistoryRequestSchema" @submit="onSubmit">
    <UCard class="md:w-fit" :ui="{ body: 'flex flex-col gap-4', footer: 'flex justify-end' }">
      <template #header>
        {{ $t('bv.form.first-year') }}
      </template>
      <UFormField :label="$t('bv.form.start')">
        <UInputDate
          v-model="calendarModel"
          :ui="{ segment: '[&:first-child]:hidden [&:nth-child(2)]:hidden' }"
        />
      </UFormField>
      <UFormField :label="$t('bv.form.contributions')">
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
      <UFormField :label="$t('bv.form.administrative-costs')">
        <UInputNumber
          v-model="state.administrativeCosts"
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
      <UFormField :label="$t('bv.form.social-security-fees')">
        <UInputNumber
          v-model="state.socialSecurityFees"
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
      <UFormField :label="$t('bv.form.performance')">
        <UInputNumber
          v-model="state.performance"
          :disabled="isLoading"
          :step="0.01"
          :format-options="{
            style: 'currency',
            currency: 'EUR',
            currencyDisplay: 'symbol',
          }"
        />
      </UFormField>

      <template #footer>
        <UButton type="submit" class="-my-1" variant="subtle" :disabled="isLoading">
          {{ $t('bv.form.submit') }}
        </UButton>
      </template>
    </UCard>
  </UForm>
</template>
