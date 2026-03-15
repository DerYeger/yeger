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
  <UCard class="h-full" :ui="{ body: 'space-y-4', footer: 'flex justify-end' }">
    <template #header>
      <h3 class="text-lg font-semibold">
        {{ title }}
      </h3>
    </template>

    <p class="text-sm text-muted">
      {{ description }}
    </p>

    <ul class="list-disc space-y-1 pl-5 text-sm text-muted">
      <li v-for="feature in features" :key="feature">{{ feature }}</li>
    </ul>

    <template #footer v-if="isLoggedIn">
      <NuxtLink
        :to="to"
        class="inline-flex items-center text-sm font-medium text-primary hover:underline"
      >
        {{ cta }}
      </NuxtLink>
    </template>
  </UCard>
</template>
