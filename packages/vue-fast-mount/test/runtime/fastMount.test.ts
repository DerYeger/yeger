import { config, flushPromises, mount, shallowMount } from '@vue/test-utils'
import { describe, expectTypeOf, test } from 'vitest'
import { defineComponent, h } from 'vue'

import { initialModelValue } from './allowedModule'
import Parent from './Parent.vue' with { vfm: 'true' }
import ParentWithSibling from './Parent.vue' with { vfm: 'Sibling,AnotherComponent' }

describe('query-based mounting', () => {
  test('should throw with regular mount before query-based component import is used', async ({
    expect,
  }) => {
    await expect(async () => mount(await import('./Parent.vue'))).rejects.toThrowError(
      'The forbiddenModule was imported.',
    )
  })

  describe('with explicit query imports', () => {
    test('stubs all children and omits their imports', async ({ expect }) => {
      const wrapper = shallowMount(Parent)

      expect(wrapper.text()).toBe('Parent')
      expect(wrapper.findComponent({ name: 'Child' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'AliasedBarrelChild' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'MixedDefaultChild' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'MixedNamedChild' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'Sibling' }).exists()).toBe(true)
    })

    test('supports inference', async ({ expect }) => {
      const wrapper = shallowMount(Parent, {
        props: { name: 'test-parent-name' },
      })

      const name = wrapper.props('name')
      expect(name).toBe('test-parent-name')
      expectTypeOf(name).toEqualTypeOf<string | undefined>()
    })

    test('supports non-stubbed children', async ({ expect }) => {
      const wrapper = shallowMount(ParentWithSibling, {
        global: { stubs: { Sibling: false } },
      })

      expect(wrapper.text()).toBe('ParentSibling')
      expect(wrapper.findComponent({ name: 'Child' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'AliasedBarrelChild' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'MixedDefaultChild' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'MixedNamedChild' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'Sibling' }).exists()).toBe(true)
    })

    test('supports custom stubs', async ({ expect }) => {
      const wrapper = shallowMount(Parent, {
        global: {
          stubs: {
            Child: defineComponent({
              name: 'Child',
              render: () => h('div', 'CustomChildStub'),
            }),
          },
        },
      })

      expect(wrapper.text()).toContain('CustomChildStub')
      expect(wrapper.findAllComponents({ name: 'Child' })).toHaveLength(3)
    })

    test('supports v-model on stubbed children', async ({ expect }) => {
      const wrapper = shallowMount(Parent)

      const sibling = wrapper.findComponent({ name: 'Sibling' })
      expect(sibling.exists()).toBe(true)
      expect(sibling.props('modelValue')).toBe(initialModelValue)

      sibling.vm.$emit('update:modelValue', 'new-sibling-value')
      await flushPromises()
      expect(sibling.props('modelValue')).toBe('new-sibling-value')

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([['new-sibling-value']])
    })

    test('supports props on stubbed children', async ({ expect }) => {
      const wrapper = shallowMount(Parent)

      const child = wrapper.findComponent({ name: 'MixedNamedChild' })
      expect(child).toBeDefined()
      expect(child!.props('childProp')).toBe(initialModelValue)
    })

    test('supports emits on stubbed children', async ({ expect }) => {
      const wrapper = shallowMount(Parent)

      const child = wrapper.findComponent({ name: 'MixedDefaultChild' })
      expect(child).toBeDefined()
      child!.vm.$emit('child-event', 'test-payload')
      await flushPromises()
      expect(wrapper.emitted('update:modelValue')).toStrictEqual([['test-payload']])
    })

    test('supports attributes on stubbed children', async ({ expect }) => {
      const wrapper = shallowMount(Parent)

      const child = wrapper.find('[data-testid="aliased-barrel-child"]')
      expect(child.exists()).toBe(true)
    })

    test('does not render default slots on stubbed children by default', async ({ expect }) => {
      const wrapper = shallowMount(Parent)
      expect(wrapper.text()).not.toContain('default-slot')
    })

    test('can render default slots on stubbed children by local config', async ({ expect }) => {
      const wrapper = shallowMount(Parent, {
        global: { renderStubDefaultSlot: true },
      })
      expect(wrapper.text()).toContain('default-slot')
    })

    test('can render default slots on stubbed children by global config', async ({
      expect,
      onTestFinished,
    }) => {
      config.global.renderStubDefaultSlot = true
      onTestFinished(() => {
        config.global.renderStubDefaultSlot = false
      })

      const wrapper = shallowMount(Parent)
      expect(wrapper.text()).toContain('default-slot')
    })

    test('maintains boolean prop shorthands', async ({ expect }) => {
      const wrapper = shallowMount(Parent)

      const aliasedBarrelChild = wrapper.findComponent({ name: 'AliasedBarrelChild' })
      expect(aliasedBarrelChild.exists()).toBe(true)
      expect(aliasedBarrelChild.props('isActive')).toBe(true)
    })
  })

  test('should throw with regular mount after query-based component import is used', async ({
    expect,
  }) => {
    await expect(async () => mount(await import('./Parent.vue'))).rejects.toThrowError(
      'The forbiddenModule was imported.',
    )
  })
})
