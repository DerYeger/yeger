import { createLocalVue } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { checkPluginInstallation, checkStorageEstimate } from './test-utils'

describe('VuePersistentStorageManager in node environment', () => {
  it('can be installed without options', async () => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm)
  })

  it('can be installed with watchStorage set to true', async () => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm, { watchStorage: true })
  })

  it('can be installed with watchStorage set to false', async () => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm, { watchStorage: false })
  })

  it('can be installed multiple times', async () => {
    const first = createLocalVue()
    await checkPluginInstallation(first, { watchStorage: true })
    const second = createLocalVue()
    await checkPluginInstallation(second, { watchStorage: true })
  })

  it('provides an empty StorageEstimate', async () => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm)
    checkStorageEstimate(vm, {})
  })

  it('allows requesting persistence', async () => {
    const vm = createLocalVue()
    await checkPluginInstallation(vm)
    await expect(vm.prototype.$storageManager.requestPersistentStorage()).resolves.toBe(false)
    expect(vm.prototype.$storageManager.isPersistent).toBe(false)
  })
})
