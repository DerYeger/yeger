export function useBAVPortfolios() {
  return useQuery({
    key: queryKeys.portfolios.bav.all,
    query: () => $fetch('/api/portfolios'),
  })
}

export function useCreateBAVPortfolio() {
  const queryCache = useQueryCache()
  const toast = useToast()
  const { t } = useI18n()

  return useMutation({
    mutation: (name: string) =>
      $fetch('/api/portfolios', {
        method: 'POST',
        body: { name } satisfies CreatePortfolioRequest,
      }),
    onSuccess: async (_, name) => {
      await queryCache.invalidateQueries({ key: queryKeys.portfolios.bav.all })
      toast.add({
        title: t('bav.toast.portfolio.created.title'),
        description: t('bav.toast.portfolio.created.description', { name }),
        color: 'success',
      })
    },
    onError: (error) => {
      toast.add({
        title: t('bav.toast.portfolio.failed.title'),
        description: error.message,
        color: 'error',
      })
    },
  })
}
