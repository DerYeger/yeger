import { shallowMount } from '@vue/test-utils'
import { describe, test, vi } from 'vitest'

vi.mock('./forbiddenModule.ts', () => ({}))

describe('Child', () => {
  test('should not throw if forbiddenModule.ts is not imported', async ({ expect }) => {
    const Child = (await import('./Child.vue')).default
    const wrapper = shallowMount(Child)
    expect(wrapper.text()).toBe('Child')
  })
})
