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

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: $t('navigation.home'),
    to: '/',
    icon: 'hugeicons:home-03',
  },
  {
    label: $t('navigation.watchtower'),
    to: '/watchtower',
    icon: 'hugeicons:airport-tower',
  },
  {
    label: $t('navigation.bav'),
    to: '/bav',
    icon: 'hugeicons:folder-upload',
  },
])

const { data: userData, error, clear } = await useFetch('/api/user')

if (error.value) {
  await navigateTo('/login')
}
</script>

<template>
  <UApp class="relative flex h-100 flex-col" :locale="nuxtUILocale">
    <UHeader>
      <template #title>
        <h1 class="text-3xl font-black tracking-widest text-black uppercase max-sm:hidden">
          Alpvara
        </h1>
      </template>
      <UNavigationMenu v-if="userData" :items="items" :ui="{ list: 'gap-6' }" />
      <template #body>
        <UNavigationMenu v-if="userData" :items="items" orientation="vertical" />
      </template>
      <template #right>
        <div class="flex justify-end gap-2">
          <ULocaleSelect
            :model-value="locale"
            :locales="[de, en]"
            @update:model-value="setLocale($event as 'en' | 'de')"
          />
          <LogoutButton v-if="userData" @logout="clear" />
          <LoginButton v-else />
        </div>
      </template>
    </UHeader>
    <UMain class="flex h-[calc(100vh-var(--ui-header-height))] flex-col overflow-y-auto">
      <NuxtPage />
    </UMain>
    <RWR />
  </UApp>
</template>
