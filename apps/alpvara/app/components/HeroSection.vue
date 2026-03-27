<script setup lang="ts">
const { isLoggedIn = false } = defineProps<{
  isLoggedIn?: boolean
}>()

const watchtowerFeatures = computed(() => [
  $t('hero.cards.watchtower.features.reit-bdc'),
  $t('hero.cards.watchtower.features.fund'),
  $t('hero.cards.watchtower.features.swap'),
])

const bvFeatures = computed(() => [
  $t('hero.cards.bv.features.import'),
  $t('hero.cards.bv.features.approximation'),
])
</script>

<template>
  <section class="relative flex min-h-full w-full flex-col">
    <div class="hero-background absolute inset-0" />
    <div class="absolute inset-0 bg-linear-to-bl from-white/70 via-white/75 to-white" />

    <div class="relative z-10 flex min-h-full flex-1 flex-col gap-8 p-6 md:p-10">
      <div class="space-y-4 text-center md:text-left">
        <h2
          class="mx-auto max-w-4xl text-3xl leading-tight font-semibold text-balance md:mx-0 md:text-5xl"
        >
          {{ $t('hero.title') }}
        </h2>
        <p class="mx-auto max-w-3xl text-base text-pretty text-muted md:mx-0 md:text-lg">
          {{ $t('hero.subtitle') }}
        </p>
      </div>

      <slot />

      <div class="flex-1 space-y-12">
        <HeroFeatureArticle
          :title="$t('navigation.watchtower')"
          :description="$t('hero.cards.watchtower.description')"
          :features="watchtowerFeatures"
          :cta="$t('hero.cards.watchtower.cta')"
          to="/watchtower"
          :is-logged-in="isLoggedIn"
        />

        <HeroFeatureArticle
          :title="$t('navigation.bv')"
          :description="$t('hero.cards.bv.description')"
          :features="bvFeatures"
          :cta="$t('hero.cards.bv.cta')"
          to="/bv"
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
  </section>
</template>

<style scoped>
.hero-background {
  background-image: url('~/assets/img/2023-08-31__valley-with-mountains.jpg');
  background-position: center;
  background-size: cover;
  filter: grayscale(10%) saturate(50%);
  opacity: 60%;
}
</style>
