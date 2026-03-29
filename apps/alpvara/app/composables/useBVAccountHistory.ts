export interface UserBVAccountHistoryOptions {
  portfolioId: MaybeRefOrGetter<string | undefined>
  accountId: MaybeRefOrGetter<string | undefined>
}

export function useBVAccountHistory({ portfolioId, accountId }: UserBVAccountHistoryOptions) {
  const query = useQuery({
    key: () =>
      queryKeys.portfolios.bv.byId(toValue(portfolioId)).byAccountId(toValue(accountId)).history,
    enabled: () => !!toValue(portfolioId) && !!toValue(accountId),
    placeholderData: undefined,
    query: async () => {
      return {
        entries: await $fetch(
          `/api/bv/${toValue(portfolioId)}/accounts/${toValue(accountId)}/history`,
        ),
        timestamp: new Date().toISOString(),
      }
    },
  })
  useErrorToast(query.error)
  void useLogoutDetection(query.error)
  return query
}

export function useCreateBVAccountHistory() {
  return useBVAccountHistoryMutation<CreateBVHistoryRequest>()
}

export function useUpdateBVAccountHistory() {
  return useBVAccountHistoryMutation<UpdateBVHistoryRequest>()
}

function useBVAccountHistoryMutation<T extends BVHistoryRequest>() {
  const toast = useToast()
  const { t } = useI18n()
  const queryCache = useQueryCache()
  const mutation = useMutation({
    mutation: (request: T & { portfolioId: string; accountId: string }) =>
      $fetch(`/api/bv/${request.portfolioId}/accounts/${request.accountId}/history`, {
        method: 'POST',
        body: request,
      }),
    onSuccess: async (_, request) => {
      await queryCache.invalidateQueries({
        key: queryKeys.portfolios.bv.byId(request.portfolioId).byAccountId(request.accountId)
          .history,
      })
      await queryCache.invalidateQueries({
        key: queryKeys.portfolios.bv.byId(request.portfolioId).accounts,
      })
      toast.add({
        id: 'bv-history-success',
        color: 'success',
        title: t('bv.toast.history.saved.title'),
        description: t('bv.toast.history.saved.description'),
      })
    },
    onError: (error) => {
      toast.add({
        id: 'bv-history-error',
        color: 'error',
        title: t('bv.toast.history.failed.title'),
        description: error.message,
      })
    },
  })
  void useLogoutDetection(mutation.error)
  return mutation
}
