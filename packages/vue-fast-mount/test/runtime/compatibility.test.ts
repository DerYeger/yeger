import { shallowMount } from '@vue/test-utils'
import { describe, test, vi } from 'vitest'

import Parent from './Parent.vue'
import ParentFastMount from './Parent.vue' with { vfm: 'true' }

vi.mock('./forbiddenModule.ts', () => ({}))

const PARENT_EXPECTED_HTML = `<div>
  <div>Parent</div>
  <child-stub isactive="false"></child-stub>
  <child-stub isactive="false"></child-stub>
  <child-stub isactive="false"></child-stub>
  <child-stub isactive="true" data-testid="aliased-barrel-child"></child-stub>
  <child-stub isactive="false"></child-stub>
  <child-stub childprop="initial-sibling-value" isactive="false"></child-stub>
  <sibling-stub modelvalue="initial-sibling-value" namedmodel="initial-sibling-value"></sibling-stub>
</div>`

describe('compatibility', () => {
  test('shallowMount produces the expected html', async ({ expect }) => {
    expect(shallowMount(Parent).html()).toBe(PARENT_EXPECTED_HTML)
  })

  test('vfm import attributes produce the expected html', async ({ expect }) => {
    expect(shallowMount(ParentFastMount).html()).toBe(PARENT_EXPECTED_HTML)
  })

  test('shallowMount baseline selectors', async ({ expect }) => {
    const wrapper = shallowMount(Parent)
    expect(wrapper.findAllComponents({ name: 'Child' })).toHaveLength(6)
  })
})
