import { shallowMount } from '@vue/test-utils'
import { describe, test, vi } from 'vitest'
import { fastMount } from 'vue-fast-mount'

import Parent from './Parent.vue'

vi.mock('./forbiddenModule.ts', () => ({}))

describe('compatibility', () => {
  test('shallowMount produces the expected html', async ({ expect }) => {
    const wrapper = shallowMount(Parent)
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div>
        <div>Parent</div>
        <child-stub isactive="false"></child-stub>
        <child-stub isactive="false"></child-stub>
        <child-stub isactive="false"></child-stub>
        <child-stub isactive="true" data-testid="aliased-barrel-child"></child-stub>
        <child-stub isactive="false"></child-stub>
        <child-stub childprop="initial-sibling-value" isactive="false"></child-stub>
        <sibling-stub modelvalue="initial-sibling-value"></sibling-stub>
      </div>"
    `)
  })

  test('fastMount produces the expected html', async ({ expect }) => {
    const wrapper = await fastMount(import('./Parent.vue'))
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div>
        <div>Parent</div>
        <child-stub></child-stub>
        <child-stub></child-stub>
        <child-stub></child-stub>
        <aliased-barrel-child-stub isactive="true" data-testid="aliased-barrel-child"></aliased-barrel-child-stub>
        <mixed-default-child-stub></mixed-default-child-stub>
        <mixed-named-child-stub childprop="initial-sibling-value"></mixed-named-child-stub>
        <sibling-stub modelvalue="initial-sibling-value"></sibling-stub>
      </div>"
    `)
  })

  test('shallowMount baseline selectors', async ({ expect }) => {
    const wrapper = shallowMount(Parent)
    expect(wrapper.findAllComponents({ name: 'Child' })).toHaveLength(6)
  })
})
