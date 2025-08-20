// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { useQuery, VueQueryPlugin } from '@tanstack/vue-query'
import { ref, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { defineKeyHierarchy, defineKeyHierarchyModule } from '~/index'
import { flushPromises } from '@vue/test-utils'
import { withVueComponentLifecycle } from '~test/vue-test-utils'

const module = defineKeyHierarchyModule((dynamic) => ({
  test: {
    identity: dynamic<MaybeRefOrGetter<string>>(),
  },
}))

describe('defineKeyHierarchy for @tanstack/vue-query', () => {
  it('works with default options', async () => {
    const keys = defineKeyHierarchy(module)
    const queryFn = vi.fn((input) => Promise.resolve(input))
    const input = ref('1')

    const { result } = withVueComponentLifecycle(() => useQuery({
      queryKey: keys.test.identity(input),
      queryFn: () => queryFn(toValue(input)),
    }), { plugins: [VueQueryPlugin] })

    await flushPromises()
    expect(queryFn).toHaveBeenCalledTimes(1)
    expect(result.data.value).toBe('1')

    input.value = '2'
    await flushPromises()
    expect(queryFn).toHaveBeenCalledTimes(2)
    expect(result.data.value).toBe('2')
  })

  it('works with precomputation', async () => {
    const keys = defineKeyHierarchy(module, { method: 'precompute' })
    const queryFn = vi.fn((input) => Promise.resolve(input))
    const input = ref('1')

    const { result } = withVueComponentLifecycle(() => useQuery({
      queryKey: keys.test.identity(input),
      queryFn: () => queryFn(toValue(input)),
    }), { plugins: [VueQueryPlugin] })

    await flushPromises()
    expect(queryFn).toHaveBeenCalledTimes(1)
    expect(result.data.value).toBe('1')

    input.value = '2'
    await flushPromises()
    expect(queryFn).toHaveBeenCalledTimes(2)
    expect(result.data.value).toBe('2')
  })

  it('does not work with freeze enabled', async () => {
    const keys = defineKeyHierarchy(module, { freeze: true })
    const queryFn = vi.fn((input) => Promise.resolve(input))
    const input = ref('1')

    const { result } = withVueComponentLifecycle(() => useQuery({
      queryKey: keys.test.identity(input),
      queryFn: () => queryFn(toValue(input)),
    }), { plugins: [VueQueryPlugin] })

    await flushPromises()
    expect(queryFn).toHaveBeenCalledTimes(1)
    expect(result.data.value).toBe('1')

    input.value = '2'
    await flushPromises()
    expect(queryFn).toHaveBeenCalledTimes(1)
    expect(result.data.value).toBe('1')
  })
})
