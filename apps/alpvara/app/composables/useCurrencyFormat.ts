export function useCurrencyFormat(currency = 'EUR') {
  const { locale } = useI18n()
  return computed(() => new Intl.NumberFormat(locale.value, { style: 'currency', currency }))
}
