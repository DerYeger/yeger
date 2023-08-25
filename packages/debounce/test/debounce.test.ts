import { describe, expect, it } from 'vitest'

import { debounce } from '~/index'

function flushTimeouts(delay?: number) {
  return new Promise((resolve) => setTimeout(resolve, delay))
}

describe('debounce', () => {
  it('invokes the callback', async () => {
    let invoked = false
    debounce(() => (invoked = true))()

    await flushTimeouts()

    expect(invoked).toBe(true)
  })

  it('cancels previous invocations', async () => {
    let counter = 0
    const increment = debounce(() => {
      counter += 1
    }, 100)

    increment()
    increment()

    await flushTimeouts(200)

    expect(counter).toBe(1)
  })
})
