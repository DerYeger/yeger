import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import MarmosetViewer from '../src/marmoset-viewer.vue'

const testFileName = 'test.mview'

const testDomRootId = 'test-dom-root'

function withPx(value: number) {
  return `${value}px`
}

const unloadMock = vi.fn()
const resizeMock = vi.fn()
const loadSceneMock = vi.fn()

class WebViewerMock {
  public unload = unloadMock
  public resize = resizeMock
  public loadScene = loadSceneMock
  public domRoot: HTMLDivElement
  public constructor(width: number, height: number, src: string) {
    const testDomRoot = document.createElement('div')
    testDomRoot.id = testDomRootId
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

const mocks = vi.hoisted(() => ({
  loadMarmoset: vi.fn(),
}))

vi.mock('../src/marmoset', async (importOriginal) => ({
  ...(await importOriginal()),
  loadMarmoset: mocks.loadMarmoset,
}))

let observeMock = vi.fn()
let unobserveMock = vi.fn()

function mockResizeObserver() {
  observeMock = vi.fn()
  unobserveMock = vi.fn()
  const resizeObserverMock = class MockResizeObserver {
    public disconnect = vi.fn()
    public observe = observeMock
    public unobserve = unobserveMock
  }
  vi.stubGlobal('ResizeObserver', resizeObserverMock)
}

describe('MarmosetViewer', () => {
  beforeAll(() => {
    mocks.loadMarmoset.mockResolvedValue(
      new Promise<void>((resolve) => {
        vi.stubGlobal('marmoset', {
          WebViewer: WebViewerMock,
        })
        resolve()
      }),
    )
  })

  beforeEach(() => {
    mockResizeObserver()
    unloadMock.mockReset()
    resizeMock.mockReset()
    loadSceneMock.mockReset()
    observeMock.mockReset()
    unobserveMock.mockReset()
  })

  it('loads the MarmosetViewer', async () => {
    const options = {
      width: 42,
      height: 31,
    }
    const wrapper = mount(MarmosetViewer, {
      props: {
        src: testFileName,
        ...options,
      },
    })
    await flushPromises()
    expect(wrapper.emitted().load?.length).toBe(1)
    const host = wrapper.find<HTMLDivElement>('.marmoset-viewer-host')
    expect(host.element).toBeDefined()
    const viewer = wrapper.find<HTMLDivElement>(`#${testDomRootId}`)
    expect(viewer.text()).toEqual(testFileName)
    expect(viewer.element.style.width).toEqual(withPx(options.width))
    expect(viewer.element.style.height).toEqual(withPx(options.height))
  })

  it('unloads the MarmosetViewer', async () => {
    const wrapper = mount(MarmosetViewer, {
      props: {
        src: testFileName,
      },
    })
    await flushPromises()
    expect(unloadMock.mock.calls.length).toEqual(0)
    expect(wrapper.emitted().unload).toBeUndefined()
    wrapper.unmount()
    expect(unloadMock.mock.calls.length).toEqual(1)
    expect(wrapper.emitted().unload?.length).toBe(1)
  })

  it('can be responsive', async () => {
    const wrapper = mount(MarmosetViewer, {
      props: {
        src: testFileName,
        responsive: true,
      },
    })
    await flushPromises()
    expect(wrapper.emitted().load?.length).toBe(1)
    const host = wrapper.find<HTMLDivElement>(
      '.marmoset-viewer-host__responsive',
    )
    expect(host.element).toBeDefined()
    const viewer = wrapper.find<HTMLDivElement>(`#${testDomRootId}`)
    expect(viewer.text()).toEqual(testFileName)
  })

  it('resizes the MarmosetViewer', async () => {
    const wrapper = mount(MarmosetViewer, {
      props: {
        src: testFileName,
        responsive: true,
      },
    })
    await flushPromises()
    expect(resizeMock.mock.calls.length).toEqual(0)
    expect(wrapper.emitted().resize).toBeUndefined()

    wrapper.vm.onResize()
    expect(resizeMock.mock.calls.length).toEqual(1)
    expect(wrapper.emitted().resize?.length).toBe(1)
  })

  it('unobserves the ResizeObserver', async () => {
    expect(observeMock.mock.calls.length).toEqual(0)
    const wrapper = mount(MarmosetViewer, {
      props: {
        src: testFileName,
        responsive: true,
      },
    })
    await flushPromises()
    expect(observeMock.mock.calls.length).toEqual(1)
    expect(unobserveMock.mock.calls.length).toEqual(0)
    expect(wrapper.emitted().unload).toBeUndefined()
    wrapper.unmount()
    expect(unobserveMock.mock.calls.length).toEqual(1)
    expect(wrapper.emitted().unload?.length).toBe(1)
  })

  it('supports autostart', async () => {
    expect(loadSceneMock.mock.calls.length).toEqual(0)
    mount(MarmosetViewer, {
      props: {
        src: testFileName,
        autoStart: true,
      },
    })
    await flushPromises()
    expect(loadSceneMock.mock.calls.length).toEqual(1)
  })

  it('reacts to src prop changes', async () => {
    const wrapper = mount(MarmosetViewer, {
      props: {
        src: testFileName,
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

  it('reacts to responsive prop changes', async () => {
    const wrapper = mount(MarmosetViewer, {
      props: {
        src: testFileName,
      },
    })
    expect(observeMock.mock.calls.length).toEqual(0)
    expect(resizeMock.mock.calls.length).toEqual(0)
    await flushPromises()
    await wrapper.setProps({
      src: testFileName,
      responsive: true,
    })
    await flushPromises()
    expect(observeMock.mock.calls.length).toEqual(1)
    expect(unobserveMock.mock.calls.length).toEqual(0)
    await wrapper.setProps({
      src: testFileName,
      responsive: false,
    })
    await flushPromises()
    expect(unobserveMock.mock.calls.length).toEqual(1)
    expect(resizeMock.mock.calls.length).toEqual(1)
  })

  it('reacts to autoStart prop changes', async () => {
    const wrapper = mount(MarmosetViewer, {
      props: {
        src: testFileName,
      },
    })
    expect(loadSceneMock.mock.calls.length).toEqual(0)
    await flushPromises()
    await wrapper.setProps({
      src: testFileName,
      autoStart: true,
    })
    await flushPromises()
    expect(loadSceneMock.mock.calls.length).toEqual(1)
  })

  it('reacts to width prop changes', async () => {
    const wrapper = mount(MarmosetViewer, {
      props: {
        src: testFileName,
      },
    })
    expect(resizeMock.mock.calls.length).toEqual(0)
    expect(wrapper.emitted().resize).toBeUndefined()
    await flushPromises()
    await wrapper.setProps({
      src: testFileName,
      width: 42,
    })
    await flushPromises()
    expect(resizeMock.mock.calls.length).toEqual(1)
    expect(wrapper.emitted().resize?.length).toBe(1)
  })

  it('reacts to height prop changes', async () => {
    const wrapper = mount(MarmosetViewer, {
      props: {
        src: testFileName,
      },
    })
    expect(resizeMock.mock.calls.length).toEqual(0)
    expect(wrapper.emitted().resize).toBeUndefined()
    await flushPromises()
    await wrapper.setProps({
      src: testFileName,
      height: 42,
    })
    await flushPromises()
    expect(resizeMock.mock.calls.length).toEqual(1)
    expect(wrapper.emitted().resize?.length).toBe(1)
  })

  it('does not react to size changes when responsive', async () => {
    const wrapper = mount(MarmosetViewer, {
      props: {
        src: testFileName,
        responsive: true,
      },
    })
    const reloadSpy = vi.spyOn(wrapper.vm, 'reloadViewer')
    await flushPromises()
    await wrapper.setProps({
      src: testFileName,
      responsive: true,
      height: 42,
    })
    await flushPromises()
    expect(reloadSpy).toHaveBeenCalledTimes(0)
    await wrapper.setProps({
      src: testFileName,
      responsive: true,
      width: 42,
    })
    await flushPromises()
    expect(reloadSpy).toHaveBeenCalledTimes(0)
  })
})
