import { describe, test, vi } from 'vitest'

import { debounce } from '../src/index'

function flushTimeouts(delay?: number) {
  return new Promise((resolve) => setTimeout(resolve, delay))
}

describe('debounce', () => {
  test('invokes the callback', async ({ expect }) => {
    const callback = vi.fn()
    debounce(callback)()

    await flushTimeouts()

    expect(callback).toHaveBeenCalledOnce()
  })

  test('cancels previous invocations', async ({ expect }) => {
    vi.useFakeTimers()

    const callback = vi.fn()
    const debounced = debounce(callback, 100)

    debounced()
    debounced()

    await vi.advanceTimersByTimeAsync(100)

    expect(callback).toHaveBeenCalledTimes(1)
  })
})
