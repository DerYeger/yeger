import { shallowMount } from '@vue/test-utils'
import { describe, test, vi } from 'vitest'

import { fastMount } from '../src/runtime'
import Parent from './Parent.vue'

vi.mock('./forbiddenModule.ts', () => ({}))

const TARGET_HTML = `
<div>
  <div>Parent</div>
  <child-stub></child-stub>
  <child-stub data-testid="aliased-barrel-child"></child-stub>
  <child-stub></child-stub>
  <child-stub></child-stub>
  <sibling-stub modelvalue="initial-sibling-value"></sibling-stub>
</div>
`.trim()

describe('html', () => {
  test('shallowMount produces the expected html', async ({ expect }) => {
    const wrapper = shallowMount(Parent)
    expect(wrapper.html()).toBe(TARGET_HTML)
  })

  test('fastMount produces the expected html', async ({ expect }) => {
    const wrapper = await fastMount(import('./Parent.vue'))
    expect(wrapper.html()).toBe(TARGET_HTML)
  })

  test('shallowMount baseline selectors', async ({ expect }) => {
    const wrapper = shallowMount(Parent)
    expect(wrapper.findAllComponents({ name: 'Child' })).toHaveLength(4)
  })
})
