<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { de, en } from '@nuxt/ui/locale'

const { locale, setLocale } = useI18n()
const nuxtUILocale = computed(() => {
  switch (locale.value) {
    case 'en':
      return en
    case 'de':
      return de
  }
})

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [
    { rel: 'icon', href: '/logo.ico', sizes: 'any' },
    { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
    { rel: 'apple-touch-icon', href: '/logo.png' },
  ],
  htmlAttrs: {
    lang: locale,
  },
})

const title = 'Alpvara'

useSeoMeta({
  title,
  description: $t('hero.subtitle'),
  ogTitle: title,
  ogDescription: $t('hero.subtitle'),
})

const { isLoggedIn, logout } = await useUser()

const watchtowerBadge = useWatchtowerBadge()

const items = computed<NavigationMenuItem[]>(() => {
  const baseRoutes: NavigationMenuItem[] = [
    {
      label: $t('navigation.legal'),
      to: '/legal',
      icon: 'hugeicons:legal-hammer',
    },
  ]
  if (!isLoggedIn.value) {
    return [
      {
        label: $t('navigation.home'),
        to: '/login',
        icon: 'hugeicons:home-03',
      },
      ...baseRoutes,
    ]
  } else {
    return [
      {
        label: $t('navigation.home'),
        to: '/',
        icon: 'hugeicons:home-03',
      },
      {
        label: $t('navigation.watchtower'),
        to: '/watchtower',
        icon: 'hugeicons:airport-tower',
        badge: watchtowerBadge.value
          ? { label: watchtowerBadge.value, color: 'primary', variant: 'subtle' }
          : undefined,
      },
      {
        label: $t('navigation.bv'),
        to: '/bv',
        icon: 'hugeicons:folder-upload',
        badge: { label: 'Beta', color: 'info', variant: 'subtle' },
      },
      ...baseRoutes,
    ]
  }
})

const open = ref(true)
</script>

<template>
  <UApp class="flex h-svh" :locale="nuxtUILocale">
    <div class="flex size-full flex-1 bg-neutral-100">
      <USidebar
        v-model:open="open"
        variant="inset"
        :ui="{
          root: '[--sidebar-width:196px]',
          container: 'h-full',
        }"
      >
        <UNavigationMenu
          :items="items"
          orientation="vertical"
          :ui="{ link: 'p-1.5 overflow-hidden' }"
        />

        <template v-if="isLoggedIn" #footer>
          <div class="mx-auto flex justify-center gap-2 lg:flex-col">
            <ULocaleSelect
              :model-value="locale"
              :locales="[de, en]"
              @update:model-value="setLocale($event as 'en' | 'de')"
            />
            <UButton variant="subtle" icon="hugeicons:logout-square-02" @click="logout">
              {{ $t('common.logout') }}
            </UButton>
          </div>
        </template>
      </USidebar>
      <div class="h-full flex-1 overflow-hidden lg:p-4" :class="{ 'lg:-ml-4': open }">
        <div
          class="flex size-full flex-col overflow-hidden border-neutral-200 bg-white shadow-sm lg:rounded-lg lg:border"
        >
          <UHeader toggle-side="left" :ui="{ container: 'mx-0 max-w-none pr-4!' }">
            <template #title>
              <h1
                class="text-2xl font-black tracking-widest text-black uppercase max-lg:ml-2 sm:text-3xl"
              >
                Alpvara
              </h1>
            </template>
            <template #toggle>
              <UButton
                icon="hugeicons:sidebar-left-01"
                color="neutral"
                variant="ghost"
                class="lg:hidden"
                aria-label="Toggle sidebar"
                @click="open = !open"
              />
            </template>
            <template #right>
              <div id="header-right"></div>
            </template>
          </UHeader>
          <UMain class="min-h-0 flex-1 overflow-y-auto overscroll-none">
            <NuxtPage />
          </UMain>
        </div>
      </div>
    </div>
  </UApp>
</template>
