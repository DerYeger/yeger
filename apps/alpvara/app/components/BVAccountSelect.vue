<script setup lang="ts">
const { accounts, portfolioId } = defineProps<{
  portfolioId: string | undefined
  accounts: BVAccount[] | undefined
}>()

const model = defineModel<string | undefined>({ required: true })

watch(
  () => accounts,
  (accounts) => {
    if (!accounts?.length) {
      // No accounts available
      model.value = undefined
    } else if (!model.value && accounts.length) {
      // Set initial value to first account if available
      model.value = accounts[0]?.id
    } else if (model.value && !accounts.some((a) => a.id === model.value)) {
      // Portfolio change or account was removed
      model.value = accounts[0]?.id
    }
  },
  { immediate: true },
)

const { mutateAsync } = useCreateBVAccount()

async function createAccount(name: string) {
  if (!portfolioId) {
    return
  }
  try {
    const response = await mutateAsync({
      name,
      portfolioId,
    })
    model.value = response.id
  } catch (_) {}
}
</script>

<template>
  <UFormField :label="$t('bv.account')" :ui="{ root: 'w-72.75 max-w-full' }">
    <UInputMenu
      v-model="model"
      class="w-full"
      :key="accounts?.length"
      :items="accounts ?? []"
      :placeholder="$t('bv.account-placeholder')"
      value-key="id"
      label-key="nickname"
      create-item
      :disabled="!portfolioId || !accounts"
      @create="createAccount"
    />
  </UFormField>
</template>
