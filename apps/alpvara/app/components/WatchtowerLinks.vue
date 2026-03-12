<script setup lang="ts">
const props = defineProps<{
  name: string
  isin: string
  fund: boolean
}>()

const parqetLink = computed(() => {
  const pascalCaseName = props.name
    .replaceAll('-', ' ')
    .split(/[\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
  return `https://app.parqet.com/aktien/${pascalCaseName}-${props.isin}`
})
</script>

<template>
  <div class="flex justify-end gap-4">
    <ExternalLink :href="parqetLink"> Parqet </ExternalLink>
    <ExternalLink
      v-if="fund"
      :href="`https://my.oekb.at/kapitalmarkt-services/kms-output/fonds-info/sd/mf/f?isin=${isin}`"
    >
      OeKB
    </ExternalLink>
    <ExternalLink v-if="fund" :href="`https://www.justetf.com/de/etf-profile.html?isin=${isin}`">
      JustETF
    </ExternalLink>
  </div>
</template>
