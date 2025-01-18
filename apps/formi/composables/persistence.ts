import type { StorageLikeAsync } from '@vueuse/core'
import { useStorageAsync } from '@vueuse/core'
import type { ModelCheckerMode } from '@yeger/fol'
import localforage from 'localforage'

const loading = ref(false)

let pendingClear: number | undefined

function setLoading() {
  if (pendingClear !== undefined) {
    clearTimeout(pendingClear)
    pendingClear = undefined
  }
  loading.value = true
}

function clearLoading() {
  pendingClear = setTimeout(
    () => (loading.value = false),
    1000,
  ) as unknown as number
}

const inMemoryStorage: Record<string, string> = {}
const inMemoryDriver: LocalForageDriver = {
  _driver: 'in-memory-driver',
  _initStorage() {},
  async getItem<T>(key: string): Promise<T | null> {
    return inMemoryStorage[key] as T
  },
  async setItem<T>(key: string, value: T): Promise<T> {
    inMemoryStorage[key] = value as string
    return value
  },
  async removeItem(key: string): Promise<void> {
    delete inMemoryStorage[key]
  },
  async clear(): Promise<void> {
    for (const key in inMemoryStorage) {
      delete inMemoryStorage[key]
    }
  },
  async length(): Promise<number> {
    return Object.keys(inMemoryStorage).length
  },
  async key(keyIndex: number): Promise<string> {
    return Object.keys(inMemoryStorage)[keyIndex]
  },
  async keys(): Promise<string[]> {
    return Object.keys(inMemoryStorage)
  },
  async iterate<T, U>(
    iteratee: (value: T, key: string, iterationNumber: number) => U,
  ): Promise<U> {
    for (const [key, value] of Object.entries(inMemoryStorage)) {
      const result = iteratee(value as T, key, 0)
      if (result !== undefined) {
        return result
      }
    }
    return undefined as U
  },
}

localforage.defineDriver(inMemoryDriver)

export function useLocalForage() {
  const localForage = localforage.createInstance({
    storeName: 'formi',
    driver: [
      localforage.INDEXEDDB,
      localforage.WEBSQL,
      localforage.LOCALSTORAGE,
      inMemoryDriver._driver,
    ],
  })

  const storage: StorageLikeAsync = {
    async getItem(key) {
      setLoading()
      const item = await localForage.getItem<string>(key)
      clearLoading()
      return item
    },
    async setItem(key, value) {
      setLoading()
      await localForage.setItem(key, value)
      clearLoading()
    },
    async removeItem(key) {
      setLoading()
      await localForage.removeItem(key)
      clearLoading()
    },
  }
  return {
    loading,
    storage,
  }
}

export function useAppStorage() {
  return useLocalForage()
}

export function useModelInput() {
  const { modelInput } = useDemoData()
  const { storage } = useAppStorage()
  return useStorageAsync('model-input', modelInput, storage)
}

export function useFormulaInput() {
  const { formula } = useDemoData()
  const { storage } = useAppStorage()
  return useStorageAsync('formula-input', formula, storage)
}

export function useModelCheckerMode() {
  const { storage } = useAppStorage()
  return useStorageAsync<ModelCheckerMode>(
    'model-checker-mode',
    'lazy',
    storage,
  )
}
