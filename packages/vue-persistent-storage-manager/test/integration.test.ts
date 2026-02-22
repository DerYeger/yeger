import type { Wrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import { beforeAll, beforeEach, describe, type ExpectStatic, test } from 'vitest'
import Vue from 'vue'

import { VuePersistentStorageManager } from '../src/index'
import {
  defineGlobals,
  persistentStoragePermission,
  redefineGlobals,
  testEstimate,
} from './test-utils'

const TestComponent = {
  template: `
    <div>
      <span id='persistent'>{{ $storageManager.isPersistent }}</span>
      <span id='usage'>{{ $storageManager.storageEstimate.usage }}</span>
      <span id='quota'>{{ $storageManager.storageEstimate.quota }}</span>
      <span id='usage-direct'>{{ $storageEstimate.usage }}</span>
      <span id='quota-direct'>{{ $storageEstimate.quota }}</span>
    </div>
  `,
}

function testStorageEstimate(
  expect: ExpectStatic,
  wrapper: Wrapper<Vue>,
  expected: StorageEstimate,
) {
  expect(+wrapper.find('#usage').text()).toEqual(expected.usage ?? 0)
  expect(+wrapper.find('#quota').text()).toEqual(expected.quota ?? 0)
  expect(+wrapper.find('#usage-direct').text()).toEqual(expected.usage ?? 0)
  expect(+wrapper.find('#quota-direct').text()).toEqual(expected.quota ?? 0)
}

describe('VuePersistentStorageManager', () => {
  beforeAll(() => defineGlobals())

  beforeEach(() => {
    redefineGlobals()
    Vue.use(VuePersistentStorageManager, { watchStorage: true })
  })

  test('provides the StorageEstimate', async ({ expect }) => {
    const wrapper = mount(TestComponent)
    testStorageEstimate(expect, wrapper, {})
    Object.defineProperty(globalThis.navigator.storage, 'estimate', {
      value: () => Promise.resolve(testEstimate),
    })
    localStorage.setItem('test', 'test')
    await flushPromises()
    testStorageEstimate(expect, wrapper, testEstimate)
  })

  test('provides the state of persistent-storage', async ({ expect }) => {
    const wrapper = mount(TestComponent)
    expect(wrapper.find('#persistent').text()).toEqual('false')
    globalThis.navigator.storage.persisted = () => Promise.resolve(true)
    persistentStoragePermission.onchange()
    await flushPromises()
    expect(wrapper.find('#persistent').text()).toEqual('true')
  })
})
