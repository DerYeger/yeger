<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui'

const selectedPortfolioId = ref<string | undefined>()

const accounts = useBVAccounts(selectedPortfolioId)

const selectedAccountId = ref<string | undefined>()

const selectedAccount = computed(() =>
  accounts.data?.value?.entries.find((a) => a.id === selectedAccountId.value),
)

const accountHistory = useBVAccountHistory({
  portfolioId: selectedPortfolioId,
  accountId: selectedAccountId,
})

const steps = computed<StepperItem[]>(() => [
  {
    description: $t('bv.help.steps.portfolio'),
  },
  {
    description: $t('bv.help.steps.account'),
  },
  {
    description: $t('bv.help.steps.history'),
  },
])

const activeStep = computed(() => {
  if (!selectedAccount.value) {
    return 0
  }
  if (!accountHistory.data.value) {
    return 1
  }
  return 2
})

const isRefreshing = computed(() => accounts.isLoading.value || accountHistory.isLoading.value)

function refresh() {
  accounts.refetch()
  if (selectedAccountId.value) {
    accountHistory.refetch()
  }
}

const isMounted = useMounted()

const refreshTimestamp = computed(() => {
  const timestamps: string[] = []
  if (accounts.data.value?.timestamp) {
    timestamps.push(accounts.data.value.timestamp)
  }
  if (accountHistory.data.value?.timestamp) {
    timestamps.push(accountHistory.data.value.timestamp)
  }
  if (!timestamps.length) {
    return undefined
  }
  return timestamps.sort((a, b) => a.localeCompare(b)).at(-1)
})
</script>

<template>
  <div class="flex min-h-full flex-col gap-4 p-4">
    <Teleport v-if="isMounted" to="#header-right">
      <div class="flex items-center gap-4">
        <InfoTooltip class="m-0">
          <div>
            {{ $t('bv.help.text') }}
            <ol class="list-decimal py-1 pl-7">
              <li>{{ $t('bv.help.steps.portfolio') }}</li>
              <li>{{ $t('bv.help.steps.account') }}</li>
              <li>{{ $t('bv.help.steps.history') }}</li>
            </ol>
            {{ $t('bv.help.hint') }}
          </div>
        </InfoTooltip>
        <RefreshButton :timestamp="refreshTimestamp" :loading="isRefreshing" @refresh="refresh" />
      </div>
    </Teleport>
    <div class="flex flex-wrap items-center gap-4">
      <BVPortfolioSelect v-model="selectedPortfolioId" />
      <BVAccountSelect
        v-model="selectedAccountId"
        :portfolio-id="selectedPortfolioId"
        :accounts="accounts.data.value?.entries"
      />
    </div>
    <div
      v-if="selectedPortfolioId && selectedAccount"
      class="flex-1 grid-cols-[auto_1fr] flex-col gap-4 max-md:flex md:grid"
    >
      <div class="flex flex-col gap-4">
        <BVHistoryForm
          v-if="!selectedAccount.position.shares || accountHistory.data.value"
          :portfolio-id="selectedPortfolioId"
          :account="selectedAccount"
          :history="accountHistory.data.value?.entries ?? []"
        />
        <BVProjectionForm />
      </div>
      <UCard
        class="grow"
        :ui="{
          root: 'flex flex-col',
          header: 'flex items-center justify-between gap-2',
          body: 'grow flex flex-col',
          footer: 'flex justify-end',
        }"
      >
        <template #header>
          {{ $t('bv.history.title') }}
          <InfoTooltip>
            {{ $t('bv.history.help') }}
          </InfoTooltip>
        </template>
        <BVHistoryChart
          v-if="accountHistory.data.value?.entries.length"
          :activities="accountHistory.data.value.entries"
        />
        <UEmpty
          v-else
          class="grow"
          variant="naked"
          :title="$t('bv.history.empty.title')"
          :description="$t('bv.history.empty.description')"
        />
        <template #footer>
          <ExternalLink
            :href="`https://app.parqet.com/p/${selectedPortfolioId}/h/${selectedAccount.id}`"
          >
            {{ $t('bv.history.view-on-parqet') }}
          </ExternalLink>
        </template>
      </UCard>
    </div>
  </div>
</template>
