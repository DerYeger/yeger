export function useBVAccounts(portfolioId: MaybeRefOrGetter<string | undefined>) {
  return useQuery({
    key: () => queryKeys.portfolios.bv.byId(toValue(portfolioId)).accounts,
    enabled: computed(() => !!toValue(portfolioId)),
    query: async () => {
      return {
        entries: await $fetch(`/api/bv/${toValue(portfolioId)}/accounts`),
        timestamp: new Date().toISOString(),
      }
    },
  })
}

export function useCreateBVAccount() {
  const queryCache = useQueryCache()
  const { t } = useI18n()
  const toast = useToast()

  return useMutation({
    mutation: ({ name, portfolioId }: { name: string; portfolioId: string }) =>
      $fetch(`/api/bv/${portfolioId}/accounts`, {
        method: 'POST',
        body: {
          name,
          assetProduct: 'insurance',
        } satisfies CreateBVAccountRequest,
      }),
    onSuccess: async (_, { name, portfolioId }) => {
      await queryCache.invalidateQueries({
        key: queryKeys.portfolios.bv.byId(portfolioId).accounts,
      })
      toast.add({
        title: t('bv.toast.account.created.title'),
        description: t('bv.toast.account.created.description', { name }),
        color: 'success',
      })
    },
    onError: (error) => {
      toast.add({
        title: t('bv.toast.account.failed.title'),
        description: error.message,
        color: 'error',
      })
    },
  })
}
