export function usePercentFormat() {
  const { locale } = useI18n()
  return computed(
    () =>
      new Intl.NumberFormat(locale.value, {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
  )
}
