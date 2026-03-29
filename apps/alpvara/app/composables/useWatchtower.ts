export function useWatchtower() {
  const query = useQuery({
    key: queryKeys.watchtower,
    query: async () => {
      return {
        holdings: await $fetch('/api/watchtower'),
        timestamp: new Date().toISOString(),
      }
    },
  })
  useErrorToast(query.error)
  void useLogoutDetection(query.error)
  return query
}

export function useWatchtowerBadge() {
  const { data } = useWatchtower()
  return computed(() => {
    return data.value?.holdings.filter(
      (holding) => !holding.isSold && Object.values(holding.warnings).some((warning) => warning),
    ).length
  })
}
