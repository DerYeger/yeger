import { shallowMount } from '@vue/test-utils'
import { describe, test, vi } from 'vitest'
import { fastMount } from 'vue-fast-mount'

import { initialModelValue } from './allowedModule'
import Parent from './Parent.vue'

vi.mock('./forbiddenModule.ts', () => ({}))

const FAST_TARGET_HTML = `
<div>
  <div>Parent</div>
  <child-stub></child-stub>
  <child-stub></child-stub>
  <child-stub></child-stub>
  <aliased-barrel-child-stub data-testid="aliased-barrel-child"></aliased-barrel-child-stub>
  <mixed-default-child-stub></mixed-default-child-stub>
  <mixed-named-child-stub childprop="${initialModelValue}"></mixed-named-child-stub>
  <sibling-stub modelvalue="${initialModelValue}"></sibling-stub>
</div>
`.trim()

const SHALLOW_TARGET_HTML = FAST_TARGET_HTML.replaceAll('<aliased-barrel-', '<')
  .replaceAll('</aliased-barrel-', '</')
  .replaceAll('<mixed-default-', '<')
  .replaceAll('</mixed-default-', '</')
  .replaceAll('<mixed-named-', '<')
  .replaceAll('</mixed-named-', '</')

describe('compatibility', () => {
  test('shallowMount produces the expected html', async ({ expect }) => {
    const wrapper = shallowMount(Parent)
    expect(wrapper.html()).toBe(SHALLOW_TARGET_HTML)
  })

  test('fastMount produces the expected html', async ({ expect }) => {
    const wrapper = await fastMount(import('./Parent.vue'))
    expect(wrapper.html()).toBe(FAST_TARGET_HTML)
  })

  test('shallowMount baseline selectors', async ({ expect }) => {
    const wrapper = shallowMount(Parent)
    expect(wrapper.findAllComponents({ name: 'Child' })).toHaveLength(6)
  })
})
