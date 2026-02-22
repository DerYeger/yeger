import { createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import { beforeAll, beforeEach, describe, test, vi } from 'vitest'

import {
  checkPluginInstallation,
  checkStorageEstimate,
  defineGlobals,
  persistentStoragePermission,
  redefineGlobals,
  testEstimate,
} from './test-utils'

describe('VuePersistentStorageManager in browser environment', () => {
  beforeAll(() => {
    defineGlobals()
  })

  beforeEach(() => {
    redefineGlobals()
  })

  test('can be installed without options', async () => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm, undefined, true)
  })

  test('can be installed with watchStorage set to true', async () => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm, { watchStorage: true }, true)
  })

  test('can be installed with watchStorage set to false', async () => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm, { watchStorage: false }, true)
  })

  test('can be installed multiple times', async () => {
    const first = createLocalVue()
    await checkPluginInstallation(first, { watchStorage: true }, true)
    const second = createLocalVue()
    await checkPluginInstallation(second, { watchStorage: true }, true)
  })

  test('provides the StorageEstimate', async () => {
    globalThis.navigator.storage.estimate = () => Promise.resolve(testEstimate)
    const vm = createLocalVue()
    await checkPluginInstallation(vm, undefined, true)
    checkStorageEstimate(vm, testEstimate)
  })

  test('updates the StorageEstimate on storage events', async () => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm, undefined, true)
    checkStorageEstimate(vm, {})
    globalThis.navigator.storage.estimate = () => Promise.resolve(testEstimate)
    globalThis.window.dispatchEvent(new StorageEvent('storage'))
    await flushPromises()
    checkStorageEstimate(vm, testEstimate)
  })

  test('updates the StorageEstimate on localStorage.setItem', async () => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm, { watchStorage: true }, true)
    vi.spyOn(localStorage, 'originalSetItem')
    checkStorageEstimate(vm, {})
    globalThis.navigator.storage.estimate = () => Promise.resolve(testEstimate)
    localStorage.setItem('test', 'test')
    await flushPromises()
    checkStorageEstimate(vm, testEstimate)
  })

  test('updates the StorageEstimate on localStorage.removeItem', async () => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm, { watchStorage: true }, true)
    vi.spyOn(localStorage, 'originalRemoveItem')
    checkStorageEstimate(vm, {})
    globalThis.navigator.storage.estimate = () => Promise.resolve(testEstimate)
    localStorage.removeItem('test')
    await flushPromises()
    checkStorageEstimate(vm, testEstimate)
  })

  test('does not update the StorageEstimate if not configured to do so', async ({ expect }) => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm, { watchStorage: false }, true)
    const setItemSpy = vi.spyOn(localStorage, 'setItem')
    const removeItemSpy = vi.spyOn(localStorage, 'removeItem')
    checkStorageEstimate(vm, {})
    globalThis.navigator.storage.estimate = () => Promise.resolve(testEstimate)
    localStorage.setItem('test', 'test')
    localStorage.removeItem('test')
    expect(setItemSpy).toHaveBeenCalledTimes(1)
    expect(removeItemSpy).toHaveBeenCalledTimes(1)
    await flushPromises()
    checkStorageEstimate(vm, {})
  })

  test('handles denied persistence', async ({ expect }) => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm, undefined, true)
    await expect(vm.prototype.$storageManager.requestPersistentStorage()).resolves.toBe(false)
    expect(vm.prototype.$storageManager.isPersistent).toBe(false)
  })

  test('handles granted persistence', async ({ expect }) => {
    globalThis.navigator.storage.persist = () => Promise.resolve(true)
    const vm = createLocalVue()
    await checkPluginInstallation(vm, undefined, true)
    await expect(vm.prototype.$storageManager.requestPersistentStorage()).resolves.toBe(true)
    expect(vm.prototype.$storageManager.isPersistent).toBe(true)
  })

  test('handles initial granted persistence', async ({ expect }) => {
    globalThis.navigator.storage.persisted = () => Promise.resolve(true)
    const vm = createLocalVue()
    await checkPluginInstallation(vm, undefined, true, true)
    expect(vm.prototype.$storageManager.isPersistent).toBe(true)
  })

  test('handles permission granted without request', async ({ expect }) => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm, undefined, true)
    expect(vm.prototype.$storageManager.isPersistent).toBe(false)
    globalThis.navigator.storage.persisted = () => Promise.resolve(true)
    persistentStoragePermission.onchange()
    await flushPromises()
    expect(vm.prototype.$storageManager.isPersistent).toBe(true)
  })

  test('handles permission revoked', async ({ expect }) => {
    globalThis.navigator.storage.persisted = () => Promise.resolve(true)
    const vm = createLocalVue()
    await checkPluginInstallation(vm, undefined, true, true)
    expect(vm.prototype.$storageManager.isPersistent).toBe(true)
    globalThis.navigator.storage.persisted = () => Promise.resolve(false)
    persistentStoragePermission.onchange()
    await flushPromises()
    expect(vm.prototype.$storageManager.isPersistent).toBe(false)
  })
})
