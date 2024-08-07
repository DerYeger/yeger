import type { PluginFunction } from 'vue'
import Vue from 'vue'

/**
 * Options for the VuePersistentStorageManager plugin.
 */
export interface PluginOptions {
  /**
   * If true, localStorage.setItem and localStorage.removeItem will be replaced with custom functions.
   */
  watchStorage: boolean
}

const defaultOptions: PluginOptions = {
  watchStorage: false,
}

/**
 * Wrapper for the StorageManager API. Provides the state of the persistent-storage permission alongside a storage estimate.
 */
export class VuePersistentStorageManager {
  /**
   * Indicates that the StorageManager API is available.
   */
  public readonly isAvailable =
    typeof navigator !== 'undefined' &&
    navigator?.storage?.persist !== undefined

  /**
   * Contains storage quota and usage information.
   */
  public readonly storageEstimate: StorageEstimate = {}

  private _isPersistent = false

  /**
   * Installs a VuePersistentStorageManager as a Vue plugin.
   */
  public static install: PluginFunction<PluginOptions> = (_Vue, options) => {
    const pluginOptions: PluginOptions = { ...defaultOptions, ...options }
    const storageManager = Vue.observable(new VuePersistentStorageManager())
    if (pluginOptions.watchStorage) {
      storageManager._modifyLocalStorageFunctions()
    }
    _Vue.prototype.$storageManager = storageManager
    _Vue.prototype.$storageEstimate = storageManager.storageEstimate
  }

  /**
   * Creates a new VuePersistentStorageManager instance.
   */
  public constructor() {
    if (!this.isAvailable) {
      return
    }
    this._refreshIsPersistent()
    this._refreshStorageEstimate()
    navigator.permissions
      ?.query({ name: 'persistent-storage' })
      ?.then((persistentStoragePermission) => {
        persistentStoragePermission.onchange = () => this._refreshIsPersistent()
      })
    window.addEventListener('storage', () => {
      this._refreshStorageEstimate()
    })
  }

  /**
   * Indicates that persistence of localStorage has been granted.
   */
  public get isPersistent(): boolean {
    return this._isPersistent
  }

  /**
   * Requests persistence of localStorage.
   * @returns a Promise that resolves to true if permission has been granted.
   */
  public requestPersistentStorage(): Promise<boolean> {
    if (!this.isAvailable) {
      return Promise.resolve(false)
    }
    return navigator.storage.persist().then((persisted) => {
      this._isPersistent = persisted
      return persisted
    })
  }

  private _refreshIsPersistent() {
    navigator.storage
      .persisted()
      .then((persisted) => (this._isPersistent = persisted))
  }

  private _refreshStorageEstimate() {
    navigator.storage.estimate().then(({ quota, usage }) => {
      Vue.set(this.storageEstimate, 'quota', quota)
      Vue.set(this.storageEstimate, 'usage', usage)
    })
  }

  private _modifyLocalStorageFunctions(): void {
    if (typeof localStorage === 'undefined') {
      return
    }
    // eslint-disable-next-line ts/no-this-alias
    const self = this
    if (typeof localStorage.originalSetItem === 'undefined') {
      localStorage.originalSetItem = localStorage.setItem
    }
    const setItem = localStorage.setItem
    localStorage.setItem = function (...args) {
      setItem.apply(this, args)
      self._refreshStorageEstimate()
    }
    if (typeof localStorage.originalRemoveItem === 'undefined') {
      localStorage.originalRemoveItem = localStorage.removeItem
    }
    const removeItem = localStorage.removeItem
    localStorage.removeItem = function (...args) {
      removeItem.apply(this, args)
      self._refreshStorageEstimate()
    }
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    /**
     * Wrapper for the StorageManager API. Provides the state of the persistent-storage permission alongside a storage estimate.
     */
    $storageManager: VuePersistentStorageManager
    /**
     * Contains storage quota and usage information.
     */
    $storageEstimate: StorageEstimate
  }
}

declare global {
  interface Storage {
    originalSetItem?: ((key: string, value: string) => void) | undefined
    originalRemoveItem?: ((key: string) => void) | undefined
  }
}
