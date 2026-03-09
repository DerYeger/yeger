import type { ModelCheckerMode } from '@yeger/fol'

export function useModelInput() {
  const { modelInput } = useDemoData()
  return useLocalStorage('model-input', modelInput)
}

export function useFormulaInput() {
  const { formula } = useDemoData()
  return useLocalStorage('formula-input', formula)
}

export function useModelCheckerMode() {
  return useLocalStorage<ModelCheckerMode>('model-checker-mode', 'lazy')
}
