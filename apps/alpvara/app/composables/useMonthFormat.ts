export function useMonthFormat(format: Intl.DateTimeFormatOptions['month'] = 'short') {
  const { locale } = useI18n()
  return computed(() => new Intl.DateTimeFormat(locale.value, { month: format, year: '2-digit' }))
}
