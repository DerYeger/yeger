/* eslint-disable no-restricted-globals */
// @vitest-environment jsdom

import { createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  checkPluginInstallation,
  checkStorageEstimate,
  defineGlobals,
  persistentStoragePermission,
  redefineGlobals,
  testEstimate,
} from '~test/test-utils'

describe('VuePersistentStorageManager in browser environment', () => {
  beforeAll(() => {
    defineGlobals()
  })

  beforeEach(() => {
    redefineGlobals()
  })

  it('can be installed without options', async () => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm, undefined, true)
  })

  it('can be installed with watchStorage set to true', async () => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm, { watchStorage: true }, true)
  })

  it('can be installed with watchStorage set to false', async () => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm, { watchStorage: false }, true)
  })

  it('can be installed multiple times', async () => {
    const first = createLocalVue()
    await checkPluginInstallation(first, { watchStorage: true }, true)
    const second = createLocalVue()
    await checkPluginInstallation(second, { watchStorage: true }, true)
  })

  it('provides the StorageEstimate', async () => {
    global.navigator.storage.estimate = () => Promise.resolve(testEstimate)
    const vm = createLocalVue()
    await checkPluginInstallation(vm, undefined, true)
    checkStorageEstimate(vm, testEstimate)
  })

  it('updates the StorageEstimate on storage events', async () => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm, undefined, true)
    checkStorageEstimate(vm, {})
    global.navigator.storage.estimate = () => Promise.resolve(testEstimate)
    global.window.dispatchEvent(new StorageEvent('storage'))
    await flushPromises()
    checkStorageEstimate(vm, testEstimate)
  })

  it('updates the StorageEstimate on localStorage.setItem', async () => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm, { watchStorage: true }, true)
    vi.spyOn(localStorage, 'originalSetItem')
    checkStorageEstimate(vm, {})
    global.navigator.storage.estimate = () => Promise.resolve(testEstimate)
    localStorage.setItem('test', 'test')
    await flushPromises()
    checkStorageEstimate(vm, testEstimate)
  })

  it('updates the StorageEstimate on localStorage.removeItem', async () => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm, { watchStorage: true }, true)
    vi.spyOn(localStorage, 'originalRemoveItem')
    checkStorageEstimate(vm, {})
    global.navigator.storage.estimate = () => Promise.resolve(testEstimate)
    localStorage.removeItem('test')
    await flushPromises()
    checkStorageEstimate(vm, testEstimate)
  })

  it('does not update the StorageEstimate if not configured to do so', async () => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm, { watchStorage: false }, true)
    const setItemSpy = vi.spyOn(localStorage, 'setItem')
    const removeItemSpy = vi.spyOn(localStorage, 'removeItem')
    checkStorageEstimate(vm, {})
    global.navigator.storage.estimate = () => Promise.resolve(testEstimate)
    localStorage.setItem('test', 'test')
    localStorage.removeItem('test')
    expect(setItemSpy).toHaveBeenCalledTimes(1)
    expect(removeItemSpy).toHaveBeenCalledTimes(1)
    await flushPromises()
    checkStorageEstimate(vm, {})
  })

  it('handles denied persistence', async () => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm, undefined, true)
    await expect(
      vm.prototype.$storageManager.requestPersistentStorage(),
    ).resolves.toBe(false)
    expect(vm.prototype.$storageManager.isPersistent).toBe(false)
  })

  it('handles granted persistence', async () => {
    global.navigator.storage.persist = () => Promise.resolve(true)
    const vm = createLocalVue()
    await checkPluginInstallation(vm, undefined, true)
    await expect(
      vm.prototype.$storageManager.requestPersistentStorage(),
    ).resolves.toBe(true)
    expect(vm.prototype.$storageManager.isPersistent).toBe(true)
  })

  it('handles initial granted persistence', async () => {
    global.navigator.storage.persisted = () => Promise.resolve(true)
    const vm = createLocalVue()
    await checkPluginInstallation(vm, undefined, true, true)
    expect(vm.prototype.$storageManager.isPersistent).toBe(true)
  })

  it('handles permission granted without request', async () => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm, undefined, true)
    expect(vm.prototype.$storageManager.isPersistent).toBe(false)
    global.navigator.storage.persisted = () => Promise.resolve(true)
    persistentStoragePermission.onchange()
    await flushPromises()
    expect(vm.prototype.$storageManager.isPersistent).toBe(true)
  })

  it('handles permission revoked', async () => {
    global.navigator.storage.persisted = () => Promise.resolve(true)
    const vm = createLocalVue()
    await checkPluginInstallation(vm, undefined, true, true)
    expect(vm.prototype.$storageManager.isPersistent).toBe(true)
    global.navigator.storage.persisted = () => Promise.resolve(false)
    persistentStoragePermission.onchange()
    await flushPromises()
    expect(vm.prototype.$storageManager.isPersistent).toBe(false)
  })
})
