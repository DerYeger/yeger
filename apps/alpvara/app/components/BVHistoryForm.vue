<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

const { portfolioId, account, history } = defineProps<{
  portfolioId: string
  account: BVAccount
  history: BVActivity[]
}>()

const LAST_YEAR = new Date().getFullYear() - 1
const ALL_MONTHS = Array.from({ length: 12 }, (_, index) => index + 1)

const isInitialYear = computed(() => account.position.shares === 0)

const state = reactive(getInitialState())

function getInitialState(): CreateBVHistoryRequest | UpdateBVHistoryRequest {
  if (isInitialYear.value) {
    return {
      type: 'create',
      year: LAST_YEAR,
      contributionMonths: [...ALL_MONTHS],
      contributions: 0,
      administrativeCosts: 0,
      socialSecurityFees: 0,
      performance: 0,
    }
  }

  const lastActivity = history[0]
  const nextYearToFill = lastActivity
    ? new Date(lastActivity.datetime).getFullYear() + 1
    : new Date().getFullYear() - 1

  return {
    type: 'update',
    year: nextYearToFill,
    contributionMonths: [...ALL_MONTHS],
    contributions: 0,
    administrativeCosts: 0,
    socialSecurityFees: 0,
    performance: 0,
    lastQuote: account.quote.price,
    lastShares: account.position.shares,
  }
}

watch([() => account, () => history], () => {
  Object.assign(state, getInitialState())
})

watch(
  () => state.contributionMonths,
  (months) => {
    if (months.length === 0) {
      state.contributionMonths = [...ALL_MONTHS]
      return
    }
    const normalizedMonths = [...new Set(months)].sort((a, b) => a - b)
    if (
      normalizedMonths.length !== months.length ||
      normalizedMonths.some((month, index) => month !== months[index])
    ) {
      state.contributionMonths = normalizedMonths
    }
  },
)

const { mutateAsync: createHistory, isLoading: isCreating } = useCreateBVAccountHistory()
const { mutateAsync: updateHistory, isLoading: isUpdating } = useUpdateBVAccountHistory()

const isLoading = computed(() => isCreating.value || isUpdating.value)

async function onSubmit(event: FormSubmitEvent<BVHistoryRequest>) {
  try {
    if (event.data.type === 'create') {
      await createHistory({
        ...event.data,
        portfolioId,
        accountId: account.id,
      })
    } else {
      await updateHistory({
        ...event.data,
        portfolioId,
        accountId: account.id,
      })
    }
  } catch (_) {}
}

const schema = computed(() =>
  isInitialYear.value ? CreateBVHistoryRequestSchema : UpdateBVHistoryRequestSchema,
)

const canYearBeEdited = computed(() => {
  if (isInitialYear.value) {
    return true
  }
  const currentYear = new Date().getFullYear()
  return state.year < currentYear
})

const { locale, t } = useI18n()

const monthFormat = computed(
  () =>
    new Intl.DateTimeFormat(locale.value, {
      month: 'long',
    }),
)

const monthOptions = computed(() =>
  ALL_MONTHS.map((month) => ({
    value: month,
    label: monthFormat.value.format(new Date(Date.UTC(2020, month - 1, 1))),
  })),
)

const selectedMonthsLabel = computed(() => {
  const count = state.contributionMonths.length
  const key = count === 1 ? 'bv.form.selected-months-one' : 'bv.form.selected-months-other'
  return t(key, { count })
})
</script>

<template>
  <UForm :state="state" :schema="schema" @submit="onSubmit">
    <UCard
      class="w-full max-w-full md:w-75"
      :ui="{
        header: 'flex items-center justify-between gap-2',
        body: 'flex flex-col gap-4',
        footer: 'flex justify-end',
      }"
    >
      <template #header>
        {{ isInitialYear ? $t('bv.form.first-year') : state.year }}
      </template>

      <template v-if="canYearBeEdited">
        <UFormField v-if="isInitialYear" :label="$t('bv.form.year')">
          <UInputNumber
            v-model="state.year"
            :disabled="isLoading"
            :min="1900"
            :max="LAST_YEAR"
            :step="1"
            class="w-full"
            :format-options="{
              useGrouping: false,
            }"
          />
        </UFormField>

        <UFormField :label="$t('bv.form.contribution-months')">
          <USelect
            v-model="state.contributionMonths"
            :disabled="isLoading"
            :items="monthOptions"
            value-key="value"
            label-key="label"
            multiple
            class="w-full"
            :ui="{
              value: 'max-w-full text-transparent overflow-hidden',
              leading: 'whitespace-nowrap',
            }"
          >
            <template #leading>
              {{ selectedMonthsLabel }}
            </template>
          </USelect>
        </UFormField>

        <UFormField :label="$t('bv.form.contributions')">
          <UInputNumber
            v-model="state.contributions"
            :disabled="isLoading"
            :min="0"
            :step="0.01"
            class="w-full"
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
            class="w-full"
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
            class="w-full"
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
            class="w-full"
            :format-options="{
              style: 'currency',
              currency: 'EUR',
              currencyDisplay: 'symbol',
            }"
          />
        </UFormField>
      </template>
      <template v-else-if="!isInitialYear">
        <span class="mx-auto text-muted">
          {{ $t('bv.form.current-year') }}
        </span>
      </template>

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
