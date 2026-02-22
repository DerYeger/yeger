// @vitest-environment node

import { createLocalVue } from '@vue/test-utils'
import { describe, test } from 'vitest'

import { checkPluginInstallation, checkStorageEstimate } from './test-utils'

describe('VuePersistentStorageManager in node environment', () => {
  test('can be installed without options', async () => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm)
  })

  test('can be installed with watchStorage set to true', async () => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm, { watchStorage: true })
  })

  test('can be installed with watchStorage set to false', async () => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm, { watchStorage: false })
  })

  test('can be installed multiple times', async () => {
    const first = createLocalVue()
    await checkPluginInstallation(first, { watchStorage: true })
    const second = createLocalVue()
    await checkPluginInstallation(second, { watchStorage: true })
  })

  test('provides an empty StorageEstimate', async () => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm)
    checkStorageEstimate(vm, {})
  })

  test('allows requesting persistence', async ({ expect }) => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm)
    await expect(vm.prototype.$storageManager.requestPersistentStorage()).resolves.toBe(false)
    expect(vm.prototype.$storageManager.isPersistent).toBe(false)
  })
})
