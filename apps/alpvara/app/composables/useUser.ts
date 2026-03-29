export async function useUser() {
  const { data: userData, clear } = await useFetch('/api/user')

  const isLoggedIn = computed(() => !!userData.value)

  async function logout() {
    await $fetch('/api/logout', {
      method: 'POST',
    })
    await onLogout()
  }

  async function onLogout() {
    localStorage.clear()
    clear()
    await navigateTo('/login')
  }

  const router = useRouter()

  watch(
    isLoggedIn,
    async (isLoggedIn) => {
      if (!isLoggedIn) {
        await onLogout()
      } else if (router.currentRoute.value.path === '/login') {
        await navigateTo('/')
      }
    },
    { immediate: true },
  )

  router.beforeEach((to) => {
    if (to.path === '/legal') {
      return true
    } else if (!isLoggedIn.value && to.path !== '/login') {
      return false
    } else if (isLoggedIn.value && to.path === '/login') {
      return false
    }
    return true
  })

  return {
    isLoggedIn,
    logout,
    onLogout,
  }
}

export async function useLogoutDetection(error: MaybeRefOrGetter<Error | null>) {
  const { onLogout } = await useUser()
  watch(
    () => toValue(error),
    async (error) => {
      if (!error) {
        return
      }
      const isUnauthorized = error.message.includes(' 401 ') || error.message.includes(' 403 ')
      if (isUnauthorized) {
        await onLogout()
      }
    },
  )
}
