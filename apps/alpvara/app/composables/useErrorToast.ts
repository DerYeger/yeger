export function useErrorToast(error: MaybeRefOrGetter<Error | null>) {
  const { t } = useI18n()
  const toast = useToast()

  watch(
    () => toValue(error),
    (error) => {
      if (error) {
        toast.add({
          title: t('common.error'),
          description: error.message,
          color: 'error',
        })
      }
    },
    { immediate: true },
  )
}
