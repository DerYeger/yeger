import { shallowMount } from '@vue/test-utils'
import { describe, test, vi } from 'vitest'

import Parent from './Parent.vue'
import ParentFastMount from './Parent.vue' with { vfm: 'true' }

vi.mock('./forbiddenModule.ts', () => ({}))

describe('compatibility', () => {
  test('shallowMount produces the expected html', async ({ expect }) => {
    expect(shallowMount(Parent).html()).toMatchInlineSnapshot(`
      "<div>
        <div>Parent</div>
        <child-stub isactive="false"></child-stub>
        <child-stub isactive="false"></child-stub>
        <child-stub isactive="false"></child-stub>
        <child-stub isactive="true" data-testid="aliased-barrel-child"></child-stub>
        <child-stub isactive="false"></child-stub>
        <child-stub childprop="initial-sibling-value" isactive="false"></child-stub>
        <sibling-stub modelvalue="initial-sibling-value" namedmodel="initial-sibling-value"></sibling-stub>
      </div>"
    `)
  })

  test('vfm import attributes produce the expected html', async ({ expect }) => {
    expect(shallowMount(ParentFastMount).html()).toMatchInlineSnapshot(`
      "<div>
        <div>Parent</div>
        <child-stub></child-stub>
        <child-stub></child-stub>
        <child-stub></child-stub>
        <aliased-barrel-child-stub isactive="true" data-testid="aliased-barrel-child"></aliased-barrel-child-stub>
        <mixed-default-child-stub></mixed-default-child-stub>
        <mixed-named-child-stub childprop="initial-sibling-value"></mixed-named-child-stub>
        <sibling-stub modelvalue="initial-sibling-value" namedmodel="initial-sibling-value"></sibling-stub>
      </div>"
    `)
  })

  test('shallowMount baseline selectors', async ({ expect }) => {
    const wrapper = shallowMount(Parent)
    expect(wrapper.findAllComponents({ name: 'Child' })).toHaveLength(6)
  })
})
