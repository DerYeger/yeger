export function useBVPortfolios() {
  const query = useQuery({
    key: queryKeys.portfolios.bv.all,
    query: () => $fetch('/api/portfolios'),
  })
  useErrorToast(query.error)
  void useLogoutDetection(query.error)
  return query
}

export function useCreateBVPortfolio() {
  const queryCache = useQueryCache()
  const toast = useToast()
  const { t } = useI18n()

  const mutation = useMutation({
    mutation: (name: string) =>
      $fetch('/api/portfolios', {
        method: 'POST',
        body: { name } satisfies CreatePortfolioRequest,
      }),
    onSuccess: async (_, name) => {
      await queryCache.invalidateQueries({ key: queryKeys.portfolios.bv.all })
      toast.add({
        title: t('bv.toast.portfolio.created.title'),
        description: t('bv.toast.portfolio.created.description', { name }),
        color: 'success',
      })
    },
    onError: (error) => {
      toast.add({
        title: t('bv.toast.portfolio.failed.title'),
        description: error.message,
        color: 'error',
      })
    },
  })
  void useLogoutDetection(mutation.error)
  return mutation
}
