<script setup lang="ts">
const { accounts, portfolioId } = defineProps<{
  portfolioId: string | undefined
  accounts: BAVAccount[] | undefined
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
)

const { mutateAsync } = useCreateBAVAccount()

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
  <UFormField :label="$t('bav.account')">
    <UInputMenu
      :key="accounts?.length"
      v-model="model"
      :items="accounts ?? []"
      value-key="id"
      label-key="nickname"
      create-item
      :disabled="!portfolioId || !accounts"
      class="w-full"
      @create="createAccount"
    />
  </UFormField>
</template>
