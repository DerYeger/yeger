// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { useQuery, VueQueryPlugin } from '@tanstack/vue-query'
import { ref, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { defineKeyHierarchy } from '~/index'
import { flushPromises } from '@vue/test-utils'
import { withVueComponentLifecycle } from '~test/vue-test-utils'

describe('defineKeyHierarchy for @tanstack/vue-query', () => {
  it('works with default options', async () => {
    const identitySpy = vi.fn((_input: MaybeRefOrGetter<string>) => true)
    const keys = defineKeyHierarchy({
      test: {
        identity: identitySpy,
      },
    })
    const queryFn = vi.fn((input) => Promise.resolve(input))
    const input = ref('1')

    const { result } = withVueComponentLifecycle(() => useQuery({
      queryKey: keys.test.identity(input),
      queryFn: () => queryFn(toValue(input)),
    }), { plugins: [VueQueryPlugin] })

    await flushPromises()
    expect(identitySpy).toHaveBeenCalledTimes(1)
    expect(queryFn).toHaveBeenCalledTimes(1)
    expect(result.data.value).toBe('1')

    input.value = '2'
    await flushPromises()
    expect(identitySpy).toHaveBeenCalledTimes(1)
    expect(queryFn).toHaveBeenCalledTimes(2)
    expect(result.data.value).toBe('2')
  })

  it('works with default precomputation', async () => {
    const identitySpy = vi.fn((_input: MaybeRefOrGetter<string>) => true)
    const keys = defineKeyHierarchy({
      test: {
        identity: identitySpy,
      },
    }, { method: 'precompute' })
    const queryFn = vi.fn((input) => Promise.resolve(input))
    const input = ref('1')

    const { result } = withVueComponentLifecycle(() => useQuery({
      queryKey: keys.test.identity(input),
      queryFn: () => queryFn(toValue(input)),
    }), { plugins: [VueQueryPlugin] })

    await flushPromises()
    expect(identitySpy).toHaveBeenCalledTimes(1)
    expect(queryFn).toHaveBeenCalledTimes(1)
    expect(result.data.value).toBe('1')

    input.value = '2'
    await flushPromises()
    expect(identitySpy).toHaveBeenCalledTimes(1)
    expect(queryFn).toHaveBeenCalledTimes(2)
    expect(result.data.value).toBe('2')
  })

  it('does not work with freeze enabled', async () => {
    const identitySpy = vi.fn((_input: MaybeRefOrGetter<string>) => true)
    const keys = defineKeyHierarchy({
      test: {
        identity: identitySpy,
      },
    }, { freeze: true })
    const queryFn = vi.fn((input) => Promise.resolve(input))
    const input = ref('1')

    const { result } = withVueComponentLifecycle(() => useQuery({
      queryKey: keys.test.identity(input),
      queryFn: () => queryFn(toValue(input)),
    }), { plugins: [VueQueryPlugin] })

    await flushPromises()
    expect(identitySpy).toHaveBeenCalledTimes(1)
    expect(queryFn).toHaveBeenCalledTimes(1)
    expect(result.data.value).toBe('1')

    input.value = '2'
    await flushPromises()
    expect(identitySpy).toHaveBeenCalledTimes(1)
    expect(queryFn).toHaveBeenCalledTimes(1)
    expect(result.data.value).toBe('1')
  })
})
