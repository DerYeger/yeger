<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { de, en } from '@nuxt/ui/locale'

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
  htmlAttrs: {
    lang: 'en',
  },
})

const title = 'Alpvara'
const description = 'A Parqet integration for Austria-specific features'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
})

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: $t('navigation.home'),
    to: '/',
  },
  {
    label: $t('navigation.watchtower'),
    to: '/watchtower',
  },
  {
    label: $t('navigation.bav'),
    to: '/bav',
  },
])

const { data, error, clear } = await useFetch('/api/user')

if (error.value) {
  await navigateTo('/login')
}

async function logout() {
  clear()
  await $fetch('/api/logout', {
    method: 'POST',
  })
  await navigateTo('/login')
}

const { locale, setLocale } = useI18n()

const nuxtUILocale = computed(() => {
  switch (locale.value) {
    case 'en':
      return en
    case 'de':
      return de
  }
})
</script>

<template>
  <UApp class="relative flex h-100 flex-col" :locale="nuxtUILocale">
    <UHeader>
      <template #title>
        <h1 class="text-3xl font-black tracking-widest text-black uppercase max-sm:hidden">
          Alpvara
        </h1>
      </template>
      <UNavigationMenu v-if="data" :items="items" :ui="{ list: 'gap-6' }" />
      <template #body>
        <UNavigationMenu v-if="data" :items="items" orientation="vertical" />
      </template>
      <template #right>
        <div class="flex justify-end gap-2">
          <ULocaleSelect
            :model-value="locale"
            :locales="[de, en]"
            @update:model-value="setLocale($event as 'en' | 'de')"
          />
          <UButton v-if="data" variant="subtle" @click="logout">
            {{ $t('common.logout') }}
          </UButton>
        </div>
      </template>
    </UHeader>
    <UMain class="flex h-[calc(100vh-var(--ui-header-height))] flex-col overflow-y-auto">
      <NuxtPage />
    </UMain>
    <RWR />
  </UApp>
</template>
