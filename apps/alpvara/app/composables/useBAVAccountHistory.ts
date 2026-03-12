export interface UserBAVAccountHistoryOptions {
  portfolioId: MaybeRefOrGetter<string | undefined>
  accountId: MaybeRefOrGetter<string | undefined>
}

export function useBAVAccountHistory({ portfolioId, accountId }: UserBAVAccountHistoryOptions) {
  return useQuery({
    key: () =>
      queryKeys.portfolios.bav.byId(toValue(portfolioId)).byAccountId(toValue(accountId)).history,
    enabled: () => !!toValue(portfolioId) && !!toValue(accountId),
    placeholderData: undefined,
    query: () => $fetch(`/api/bav/${toValue(portfolioId)}/accounts/${toValue(accountId)}/history`),
  })
}

export function useCreateBAVAccountHistory() {
  return useBAVAccountHistoryMutation<CreateBAVHistoryRequest>()
}

export function useUpdateBAVAccountHistory() {
  return useBAVAccountHistoryMutation<UpdateBAVHistoryRequest>()
}

function useBAVAccountHistoryMutation<T extends BAVHistoryRequest>() {
  const toast = useToast()
  const { t } = useI18n()
  const queryCache = useQueryCache()
  return useMutation({
    mutation: async (request: T & { portfolioId: string; accountId: string }) =>
      $fetch(`/api/bav/${request.portfolioId}/accounts/${request.accountId}/history`, {
        method: 'POST',
        body: request,
      }),
    onSuccess: async (_, request) => {
      await queryCache.invalidateQueries({
        key: queryKeys.portfolios.bav.byId(request.portfolioId).byAccountId(request.accountId)
          .history,
      })
      await queryCache.invalidateQueries({
        key: queryKeys.portfolios.bav.byId(request.portfolioId).accounts,
      })
      toast.add({
        color: 'success',
        title: t('bav.toast.history.saved.title'),
        description: t('bav.toast.history.saved.description'),
      })
    },
    onError: (error) => {
      toast.add({
        color: 'error',
        title: t('bav.toast.history.failed.title'),
        description: error.message,
      })
    },
  })
}
