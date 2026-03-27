export function useWatchtower() {
  return useQuery({
    key: queryKeys.watchtower,
    query: async () => {
      return {
        holdings: await $fetch('/api/watchtower'),
        timestamp: new Date().toISOString(),
      }
    },
  })
}

export function useWatchtowerBadge() {
  const { data } = useWatchtower()
  return computed(() => {
    return data.value?.holdings.filter(
      (holding) => !holding.isSold && Object.values(holding.warnings).some((warning) => warning),
    ).length
  })
}
