<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui'

const selectedPortfolioId = ref<string | undefined>()

const { data: accounts } = useBAVAccounts(selectedPortfolioId)

const selectedAccountId = ref<string | undefined>()

const selectedAccount = computed(() =>
  accounts?.value?.find((a) => a.id === selectedAccountId.value),
)

const { data: accountHistory } = useBAVAccountHistory({
  portfolioId: selectedPortfolioId,
  accountId: selectedAccountId,
})

const steps = computed<StepperItem[]>(() => [
  {
    description: $t('bav.help.steps.portfolio'),
  },
  {
    description: $t('bav.help.steps.account'),
  },
  {
    description: $t('bav.help.steps.history'),
  },
])

const activeStep = computed(() => {
  if (!selectedAccount.value) {
    return 0
  }
  if (!accountHistory.value) {
    return 1
  }
  return 2
})
</script>

<template>
  <UContainer class="mx-auto space-y-8 py-4">
    <div class="flex items-center gap-4">
      <BAVPortfolioSelect v-model="selectedPortfolioId" />
      <BAVAccountSelect
        v-model="selectedAccountId"
        :portfolio-id="selectedPortfolioId"
        :accounts="accounts"
      />
      <InfoTooltip class="mt-6">
        {{ $t('bav.help.text') }}
        <UStepper
          :model-value="activeStep"
          disabled
          :items="steps"
          class="mx-auto mt-4 max-w-[80dvw]"
        />
      </InfoTooltip>
    </div>
    <div v-if="selectedPortfolioId && selectedAccount" class="flex gap-4 max-md:flex-wrap">
      <BAVCreateHistoryForm
        v-if="!selectedAccount?.position.shares"
        :portfolio-id="selectedPortfolioId"
        :account-id="selectedAccount.id"
      />
      <BAVUpdateHistoryForm
        v-else-if="accountHistory"
        :portfolio-id="selectedPortfolioId"
        :account="selectedAccount"
        :history="accountHistory"
      />
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
          {{ $t('bav.history.title') }}
          <InfoTooltip>
            {{ $t('bav.history.help') }}
          </InfoTooltip>
        </template>
        <BAVHistoryChart v-if="accountHistory?.length" :activities="accountHistory" />
        <UEmpty
          v-else
          class="grow"
          variant="naked"
          :title="$t('bav.history.empty.title')"
          :description="$t('bav.history.empty.description')"
        />
        <template #footer>
          <ExternalLink
            :href="`https://app.parqet.com/p/${selectedPortfolioId}/h/${selectedAccount.id}`"
          >
            {{ $t('bav.history.view-on-parqet') }}
          </ExternalLink>
        </template>
      </UCard>
    </div>
  </UContainer>
</template>
