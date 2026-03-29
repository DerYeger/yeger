export const useBVProjection = createGlobalState(() => {
  const enabled = useLocalStorage('bv-projection-enabled', () => false)
  const years = useLocalStorage('bv-projection-years', () => 10)
  const annualContribution = useLocalStorage('bv-projection-annual-contribution', () => 750)
  const annualReturn = useLocalStorage('bv-projection-annual-net-return', () => 0.02)

  const DEBOUNCE_MS = 300

  const state = computed(() => ({
    enabled: enabled.value,
    years: years.value,
    annualContribution: annualContribution.value,
    annualReturn: annualReturn.value,
    pessimisticAnnualReturn: annualReturn.value - Math.abs(annualReturn.value || 0.01) / 3,
    optimisticAnnualReturn: annualReturn.value + Math.abs(annualReturn.value || 0.01) / 3,
  }))

  const debouncedState = debouncedRef(state, DEBOUNCE_MS)

  return {
    enabled,
    years,
    annualContribution,
    annualReturn,
    state,
    debouncedState,
  }
})
