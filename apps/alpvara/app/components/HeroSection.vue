<script setup lang="ts">
const { isLoggedIn = false } = defineProps<{
  isLoggedIn?: boolean
}>()

const watchtowerFeatures = computed(() => [
  $t('hero.cards.watchtower.features.reit-bdc'),
  $t('hero.cards.watchtower.features.fund'),
  $t('hero.cards.watchtower.features.swap'),
])

const bavFeatures = computed(() => [
  $t('hero.cards.bav.features.import'),
  $t('hero.cards.bav.features.approximation'),
])
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-4 py-6">
    <div class="space-y-6 p-6 md:p-8">
      <div class="space-y-3 text-center md:text-left">
        <h2 class="text-2xl font-semibold text-balance md:text-3xl">
          {{ $t('hero.title') }}
        </h2>
        <p class="mx-auto max-w-3xl text-pretty text-muted md:mx-0">
          {{ $t('hero.subtitle') }}
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <HeroFeatureCard
          :title="$t('navigation.watchtower')"
          :description="$t('hero.cards.watchtower.description')"
          :features="watchtowerFeatures"
          :cta="$t('hero.cards.watchtower.cta')"
          to="/watchtower"
          :is-logged-in="isLoggedIn"
        />

        <HeroFeatureCard
          :title="$t('navigation.bav')"
          :description="$t('hero.cards.bav.description')"
          :features="bavFeatures"
          :cta="$t('hero.cards.bav.cta')"
          to="/bav"
          :is-logged-in="isLoggedIn"
        />
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
        <span>{{ $t('hero.disclaimer') }}</span>
        <ExternalLink href="https://github.com/DerYeger/yeger/tree/main/apps/alpvara">
          {{ $t('hero.github') }}
        </ExternalLink>
      </div>
    </div>
  </div>
</template>
