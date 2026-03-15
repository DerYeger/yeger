<script setup lang="ts">
const emit = defineEmits<{
  (event: 'logout'): void
}>()
async function logout() {
  emit('logout')
  await $fetch('/api/logout', {
    method: 'POST',
  })
  await navigateTo('/login')
}
</script>

<template>
  <UButton variant="subtle" icon="hugeicons:logout-square-02" @click="logout">
    {{ $t('common.logout') }}
  </UButton>
</template>
