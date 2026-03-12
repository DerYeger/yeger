export function useBAVAccounts(portfolioId: MaybeRefOrGetter<string | undefined>) {
  return useQuery({
    key: () => queryKeys.portfolios.bav.byId(toValue(portfolioId)).accounts,
    enabled: computed(() => !!toValue(portfolioId)),
    query: () => $fetch(`/api/bav/${toValue(portfolioId)}/accounts`),
  })
}

export function useCreateBAVAccount() {
  const queryCache = useQueryCache()
  const { t } = useI18n()
  const toast = useToast()

  return useMutation({
    mutation: ({ name, portfolioId }: { name: string; portfolioId: string }) =>
      $fetch(`/api/bav/${portfolioId}/accounts`, {
        method: 'POST',
        body: {
          name,
          assetProduct: 'insurance',
        } satisfies CreateBAVAccountRequest,
      }),
    onSuccess: async (_, { name, portfolioId }) => {
      await queryCache.invalidateQueries({
        key: queryKeys.portfolios.bav.byId(portfolioId).accounts,
      })
      toast.add({
        title: t('bav.toast.account.created.title'),
        description: t('bav.toast.account.created.description', { name }),
        color: 'success',
      })
    },
    onError: (error) => {
      toast.add({
        title: t('bav.toast.account.failed.title'),
        description: error.message,
        color: 'error',
      })
    },
  })
}
