<script setup lang="ts">
defineProps<{
  title: string
  description: string
  features: string[]
  cta: string
  to: string
  isLoggedIn: boolean
}>()
</script>

<template>
  <article class="flex flex-col gap-3 pl-4">
    <p class="-mb-1 text-xs font-semibold tracking-widest text-muted uppercase">
      {{ title }}
    </p>
    <p class="mb-2 text-xl text-pretty">
      {{ description }}
    </p>
    <ul class="space-y-1.5 text-sm text-muted md:text-base">
      <li v-for="feature in features" :key="feature" class="flex items-start gap-2">
        <UIcon name="hugeicons:checkmark-circle-03" class="mt-0.5 size-4 text-primary" />
        <span>{{ feature }}</span>
      </li>
    </ul>
    <NuxtLink
      v-if="isLoggedIn"
      :to="to"
      class="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:translate-x-1"
    >
      <span>{{ cta }}</span>
      <UIcon name="hugeicons:arrow-right-02" class="size-4" />
    </NuxtLink>
  </article>
</template>
