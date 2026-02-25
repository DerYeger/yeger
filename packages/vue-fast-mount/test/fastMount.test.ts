import { flushPromises, mount } from '@vue/test-utils'
import { describe, expectTypeOf, test } from 'vitest'
import { defineComponent, h } from 'vue'

import { fastMount } from '../src/runtime'

describe('Parent', () => {
  test('should throw with regular mount before fastMount is used', async ({ expect }) => {
    await expect(async () => mount(await import('./Parent.vue'))).rejects.toThrowError(
      'The forbiddenModule was imported.',
    )
  })

  describe('with fastMount', () => {
    test('stubs all children and omits their imports', async ({ expect }) => {
      const wrapper = await fastMount(import('./Parent.vue'))

      expect(wrapper.text()).toBe('Parent')
      expect(wrapper.findAllComponents({ name: 'Child' })).toHaveLength(4)
      expect(wrapper.findComponent({ name: 'Sibling' }).exists()).toBe(true)
    })

    test('supports inference', async ({ expect }) => {
      const wrapper = await fastMount(import('./Parent.vue'), {
        props: { name: 'test-parent-name' },
      })

      const name = wrapper.props('name')
      expect(name).toBe('test-parent-name')
      expectTypeOf(name).toEqualTypeOf<string | undefined>()
    })

    test('supports non-stubbed children', async ({ expect }) => {
      const wrapper = await fastMount(import('./Parent.vue'), {
        global: { stubs: { Sibling: false } },
      })

      expect(wrapper.text()).toBe('ParentSibling')
      expect(wrapper.findAllComponents({ name: 'Child' })).toHaveLength(4)
      expect(wrapper.findComponent({ name: 'Sibling' }).exists()).toBe(true)
    })

    test('supports custom stubs', async ({ expect }) => {
      const wrapper = await fastMount(import('./Parent.vue'), {
        global: {
          stubs: {
            Child: defineComponent({
              name: 'Child',
              render: () => h('div', 'CustomChildStub'),
            }),
          },
        },
      })

      expect(wrapper.text()).toBe('ParentCustomChildStub')
      expect(wrapper.findAllComponents({ name: 'Child' })).toHaveLength(4)
    })

    test('supports props and emits on stubbed children', async ({ expect }) => {
      const wrapper = await fastMount(import('./Parent.vue'))

      const sibling = wrapper.findComponent({ name: 'Sibling' })
      expect(sibling.exists()).toBe(true)
      expect(sibling.props('modelValue')).toBe('initial-sibling-value')

      sibling.vm.$emit('update:modelValue', 'new-sibling-value')
      await flushPromises()
      expect(sibling.props('modelValue')).toBe('new-sibling-value')

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([['new-sibling-value']])
    })
  })

  test('should throw with regular mount after fastMount is used', async ({ expect }) => {
    await expect(async () => mount(await import('./Parent.vue'))).rejects.toThrowError(
      'The forbiddenModule was imported.',
    )
  })
})
