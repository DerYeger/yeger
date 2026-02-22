import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, test, vi } from 'vitest'

import MarmosetViewer from '../src/marmoset-viewer.vue'

const TEST_FILE_NAME = 'test.mview'

const TEST_DOM_ROOT_ID = 'test-dom-root'

function withPx(value: number) {
  return `${value}px`
}

const mocks = vi.hoisted(() => ({
  loadMarmoset: vi.fn(),
  ResizeObserver: {
    disconnect: vi.fn(),
    observe: vi.fn(),
    unobserve: vi.fn(),
  },
  WebViewer: {
    unload: vi.fn(),
    resize: vi.fn(),
    loadScene: vi.fn(),
  },
}))

class MockResizeObserver {
  public disconnect = mocks.ResizeObserver.disconnect
  public observe = mocks.ResizeObserver.observe
  public unobserve = mocks.ResizeObserver.unobserve
}

class MockWebViewer {
  public unload = mocks.WebViewer.unload
  public resize = mocks.WebViewer.resize
  public loadScene = mocks.WebViewer.loadScene
  public domRoot: HTMLDivElement
  public constructor(width: number, height: number, src: string) {
    const testDomRoot = document.createElement('div')
    testDomRoot.id = TEST_DOM_ROOT_ID
    testDomRoot.innerHTML = src
    testDomRoot.style.width = withPx(width)
    testDomRoot.style.height = withPx(height)
    this.domRoot = testDomRoot
  }

  public get onLoad() {
    return () => {}
  }

  public set onLoad(onLoad: () => void) {
    onLoad()
  }
}

vi.mock('../src/marmoset', async (importOriginal) => ({
  ...(await importOriginal()),
  loadMarmoset: mocks.loadMarmoset,
}))

describe('MarmosetViewer', () => {
  beforeEach(() => {
    mocks.loadMarmoset.mockResolvedValue(
      new Promise<void>((resolve) => {
        vi.stubGlobal('marmoset', {
          WebViewer: MockWebViewer,
        })
        resolve()
      }),
    )
    vi.stubGlobal('ResizeObserver', MockResizeObserver)
  })

  test('loads the MarmosetViewer', async ({ expect }) => {
    const options = {
      width: 42,
      height: 31,
    }
    const wrapper = mount(MarmosetViewer, {
      props: {
        src: TEST_FILE_NAME,
        ...options,
      },
    })
    await flushPromises()
    expect(wrapper.emitted().load?.length).toBe(1)
    const host = wrapper.find<HTMLDivElement>('.marmoset-viewer-host')
    expect(host.element).toBeDefined()
    const viewer = wrapper.find<HTMLDivElement>(`#${TEST_DOM_ROOT_ID}`)
    expect(viewer.text()).toEqual(TEST_FILE_NAME)
    expect(viewer.element.style.width).toEqual(withPx(options.width))
    expect(viewer.element.style.height).toEqual(withPx(options.height))
  })

  test('unloads the MarmosetViewer', async ({ expect }) => {
    const wrapper = mount(MarmosetViewer, {
      props: {
        src: TEST_FILE_NAME,
      },
    })
    await flushPromises()
    expect(mocks.WebViewer.unload).not.toHaveBeenCalled()
    expect(wrapper.emitted().unload).toBeUndefined()
    wrapper.unmount()
    expect(mocks.WebViewer.unload).toHaveBeenCalledOnce()
    expect(wrapper.emitted().unload?.length).toBe(1)
  })

  test('can be responsive', async ({ expect }) => {
    const wrapper = mount(MarmosetViewer, {
      props: {
        src: TEST_FILE_NAME,
        responsive: true,
      },
    })
    await flushPromises()
    expect(wrapper.emitted().load?.length).toBe(1)
    const host = wrapper.find<HTMLDivElement>('.marmoset-viewer-host__responsive')
    expect(host.element).toBeDefined()
    const viewer = wrapper.find<HTMLDivElement>(`#${TEST_DOM_ROOT_ID}`)
    expect(viewer.text()).toEqual(TEST_FILE_NAME)
  })

  test('resizes the MarmosetViewer', async ({ expect }) => {
    const wrapper = mount(MarmosetViewer, {
      props: {
        src: TEST_FILE_NAME,
        responsive: true,
      },
    })
    await flushPromises()
    expect(mocks.WebViewer.resize).not.toHaveBeenCalled()
    expect(wrapper.emitted().resize).toBeUndefined()

    wrapper.vm.onResize()
    expect(mocks.WebViewer.resize).toHaveBeenCalledOnce()
    expect(wrapper.emitted().resize?.length).toBe(1)
  })

  test('unobserves the ResizeObserver', async ({ expect }) => {
    expect(mocks.ResizeObserver.observe).not.toHaveBeenCalled()
    const wrapper = mount(MarmosetViewer, {
      props: {
        src: TEST_FILE_NAME,
        responsive: true,
      },
    })
    await flushPromises()
    expect(mocks.ResizeObserver.observe).toHaveBeenCalledOnce()
    expect(mocks.ResizeObserver.unobserve).not.toHaveBeenCalled()
    expect(wrapper.emitted().unload).toBeUndefined()
    wrapper.unmount()
    expect(mocks.ResizeObserver.unobserve).toHaveBeenCalledOnce()
    expect(wrapper.emitted().unload?.length).toBe(1)
  })

  test('supports autostart', async ({ expect }) => {
    expect(mocks.WebViewer.loadScene).not.toHaveBeenCalled()
    mount(MarmosetViewer, {
      props: {
        src: TEST_FILE_NAME,
        autoStart: true,
      },
    })
    await flushPromises()
    expect(mocks.WebViewer.loadScene).toHaveBeenCalledOnce()
  })

  test('reacts to src prop changes', async ({ expect }) => {
    const wrapper = mount(MarmosetViewer, {
      props: {
        src: TEST_FILE_NAME,
      },
    })
    const reloadSpy = vi.spyOn(wrapper.vm, 'reloadViewer')
    await flushPromises()
    await wrapper.setProps({
      src: 'newSrc',
    })
    await flushPromises()
    expect(reloadSpy).toHaveBeenCalledTimes(1)
  })

  test('reacts to responsive prop changes', async ({ expect }) => {
    const wrapper = mount(MarmosetViewer, {
      props: {
        src: TEST_FILE_NAME,
      },
    })
    expect(mocks.ResizeObserver.observe).not.toHaveBeenCalled()
    expect(mocks.WebViewer.resize).not.toHaveBeenCalled()
    await flushPromises()
    await wrapper.setProps({
      src: TEST_FILE_NAME,
      responsive: true,
    })
    await flushPromises()
    expect(mocks.ResizeObserver.observe).toHaveBeenCalledOnce()
    expect(mocks.ResizeObserver.unobserve).not.toHaveBeenCalled()
    await wrapper.setProps({
      src: TEST_FILE_NAME,
      responsive: false,
    })
    await flushPromises()
    expect(mocks.ResizeObserver.unobserve).toHaveBeenCalledOnce()
    expect(mocks.WebViewer.resize).toHaveBeenCalledOnce()
  })

  test('reacts to autoStart prop changes', async ({ expect }) => {
    const wrapper = mount(MarmosetViewer, {
      props: {
        src: TEST_FILE_NAME,
      },
    })
    expect(mocks.WebViewer.loadScene).not.toHaveBeenCalled()
    await flushPromises()
    await wrapper.setProps({
      src: TEST_FILE_NAME,
      autoStart: true,
    })
    await flushPromises()
    expect(mocks.WebViewer.loadScene).toHaveBeenCalledOnce()
  })

  test('reacts to width prop changes', async ({ expect }) => {
    const wrapper = mount(MarmosetViewer, {
      props: {
        src: TEST_FILE_NAME,
      },
    })
    expect(mocks.WebViewer.resize).not.toHaveBeenCalled()
    expect(wrapper.emitted().resize).toBeUndefined()
    await flushPromises()
    await wrapper.setProps({
      src: TEST_FILE_NAME,
      width: 42,
    })
    await flushPromises()
    expect(mocks.WebViewer.resize).toHaveBeenCalledOnce()
    expect(wrapper.emitted().resize?.length).toBe(1)
  })

  test('reacts to height prop changes', async ({ expect }) => {
    const wrapper = mount(MarmosetViewer, {
      props: {
        src: TEST_FILE_NAME,
      },
    })
    expect(mocks.WebViewer.resize).not.toHaveBeenCalled()
    expect(wrapper.emitted().resize).toBeUndefined()
    await flushPromises()
    await wrapper.setProps({
      src: TEST_FILE_NAME,
      height: 42,
    })
    await flushPromises()
    expect(mocks.WebViewer.resize).toHaveBeenCalledOnce()
    expect(wrapper.emitted().resize?.length).toBe(1)
  })

  test('does not react to size changes when responsive', async ({ expect }) => {
    const wrapper = mount(MarmosetViewer, {
      props: {
        src: TEST_FILE_NAME,
        responsive: true,
      },
    })
    const reloadSpy = vi.spyOn(wrapper.vm, 'reloadViewer')
    await flushPromises()
    await wrapper.setProps({
      src: TEST_FILE_NAME,
      responsive: true,
      height: 42,
    })
    await flushPromises()
    expect(reloadSpy).toHaveBeenCalledTimes(0)
    await wrapper.setProps({
      src: TEST_FILE_NAME,
      responsive: true,
      width: 42,
    })
    await flushPromises()
    expect(reloadSpy).toHaveBeenCalledTimes(0)
  })
})
