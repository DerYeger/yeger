export function useWatchtower() {
  return useQuery({
    key: queryKeys.watchtower,
    query: () => $fetch('/api/watchtower'),
  })
}

export function useWatchtowerBadge() {
  const { data } = useWatchtower()
  return computed(() => {
    if (!data.value) {
      return undefined
    }
    return data.value.filter(
      (security) => !security.isSold && Object.values(security.warnings).some((warning) => warning),
    ).length
  })
}
