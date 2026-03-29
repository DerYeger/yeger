<script setup lang="ts">
const { enabled, years, annualContribution, annualReturn } = useBVProjection()

const { projectionData } = useBVHistoryChart()
</script>

<template>
  <UCard :ui="{ header: enabled ? undefined : 'border-b-0', body: enabled ? undefined : 'hidden' }">
    <template #header>
      <div class="flex items-center justify-between gap-2">
        <span>
          {{ $t('bv.projection.title') }}
        </span>
        <USwitch v-model="enabled" />
      </div>
    </template>
    <div class="flex flex-col gap-4">
      <UFormField :label="$t('bv.projection.years')">
        <UInputNumber v-model="years" :disabled="!enabled" :min="1" :max="60" class="w-full" />
      </UFormField>
      <UFormField :label="$t('bv.projection.annual-contribution')">
        <UInputNumber
          v-model="annualContribution"
          :disabled="!enabled"
          :min="0"
          :step="0.01"
          class="w-full"
          :format-options="{ style: 'currency', currency: 'EUR', currencyDisplay: 'narrowSymbol' }"
        />
      </UFormField>
      <UFormField :label="$t('bv.projection.annual-return')">
        <UInputNumber
          v-model="annualReturn"
          :disabled="!enabled"
          :min="-1"
          :max="1"
          :step="0.0001"
          class="w-full"
          :format-options="{ style: 'percent', minimumFractionDigits: 2 }"
        />
      </UFormField>
    </div>
    <template v-if="enabled && projectionData.length" #footer>
      <BVValueGrid
        :values="[
          {
            color: 'success',
            label: $t('bv.projection.optimistic'),
            value: projectionData.at(-1)!.optimistic,
          },
          {
            color: 'info',
            label: $t('bv.projection.expected'),
            value: projectionData.at(-1)!.expected,
          },
          {
            color: 'error',
            label: $t('bv.projection.pessimistic'),
            value: projectionData.at(-1)!.pessimistic,
          },
          {
            color: 'neutral',
            label: $t('bv.history.contributions'),
            value: projectionData.at(-1)!.contributions,
          },
        ]"
      />
    </template>
  </UCard>
</template>
