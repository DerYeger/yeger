<script setup lang="ts">
const model = defineModel<string | undefined>({ required: true })

const { data: portfolios } = useBAVPortfolios()

watch(
  portfolios,
  (portfolios) => {
    if (!portfolios?.length) {
      // No portfolios available
      model.value = undefined
    } else if (!model.value && portfolios.length) {
      // Set initial value to first portfolio if available
      model.value = portfolios[0]?.id
    } else if (model.value && !portfolios.some((p) => p.id === model.value)) {
      // Portfolio was removed
      model.value = portfolios[0]?.id
    }
  },
  { immediate: true },
)

const { mutateAsync } = useCreateBAVPortfolio()

async function createPortfolio(name: string) {
  try {
    const { id } = await mutateAsync(name)
    model.value = id
  } catch (_) {}
}
</script>

<template>
  <UFormField :label="$t('common.portfolio')">
    <UInputMenu
      v-model="model"
      :items="portfolios ?? []"
      :disabled="!portfolios"
      value-key="id"
      label-key="name"
      create-item
      @create="createPortfolio"
    />
  </UFormField>
</template>
