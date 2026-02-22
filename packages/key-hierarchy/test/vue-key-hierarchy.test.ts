import { useQuery, VueQueryPlugin } from '@tanstack/vue-query'
import { flushPromises } from '@vue/test-utils'
import { describe, test, vi } from 'vitest'
import type { MaybeRefOrGetter } from 'vue'
import { ref, toValue } from 'vue'

import { defineKeyHierarchy, defineKeyHierarchyModule } from '../src/index'
import { withVueComponentLifecycle } from './vue-test-utils'

const keyModule = defineKeyHierarchyModule((dynamic) => ({
  test: {
    identity: dynamic<MaybeRefOrGetter<string>>(),
  },
}))

describe('defineKeyHierarchy for @tanstack/vue-query', () => {
  test('works with default options', async ({ expect }) => {
    const keys = defineKeyHierarchy(keyModule)
    const queryFn = vi.fn((input) => Promise.resolve(input))
    const input = ref('1')

    const { result } = withVueComponentLifecycle(
      () =>
        useQuery({
          queryKey: keys.test.identity(input),
          queryFn: () => queryFn(toValue(input)),
        }),
      { plugins: [VueQueryPlugin] },
    )

    await flushPromises()
    expect(queryFn).toHaveBeenCalledTimes(1)
    expect(result.data.value).toBe('1')

    input.value = '2'
    await flushPromises()
    expect(queryFn).toHaveBeenCalledTimes(2)
    expect(result.data.value).toBe('2')
  })

  test('works with precomputation', async ({ expect }) => {
    const keys = defineKeyHierarchy(keyModule, { method: 'precompute' })
    const queryFn = vi.fn((input) => Promise.resolve(input))
    const input = ref('1')

    const { result } = withVueComponentLifecycle(
      () =>
        useQuery({
          queryKey: keys.test.identity(input),
          queryFn: () => queryFn(toValue(input)),
        }),
      { plugins: [VueQueryPlugin] },
    )

    await flushPromises()
    expect(queryFn).toHaveBeenCalledTimes(1)
    expect(result.data.value).toBe('1')

    input.value = '2'
    await flushPromises()
    expect(queryFn).toHaveBeenCalledTimes(2)
    expect(result.data.value).toBe('2')
  })

  test('does not work with freeze enabled', async ({ expect }) => {
    const keys = defineKeyHierarchy(keyModule, { freeze: true })
    const queryFn = vi.fn((input) => Promise.resolve(input))
    const input = ref('1')

    const { result } = withVueComponentLifecycle(
      () =>
        useQuery({
          queryKey: keys.test.identity(input),
          queryFn: () => queryFn(toValue(input)),
        }),
      { plugins: [VueQueryPlugin] },
    )

    await flushPromises()
    expect(queryFn).toHaveBeenCalledTimes(1)
    expect(result.data.value).toBe('1')

    input.value = '2'
    await flushPromises()
    expect(queryFn).toHaveBeenCalledTimes(1)
    expect(result.data.value).toBe('1')
  })
})
