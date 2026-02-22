import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import { beforeAll, beforeEach, describe, test, vi } from 'vitest'
import Vue, { defineComponent } from 'vue'

import MasonryWall from '../src/index'

const mocks = vi.hoisted(() => ({
  ResizeObserver: {
    disconnect: vi.fn(),
    observe: vi.fn(),
    unobserve: vi.fn(),
  },
}))

class MockResizeObserver {
  public disconnect = mocks.ResizeObserver.disconnect
  public observe = mocks.ResizeObserver.observe
  public unobserve = mocks.ResizeObserver.unobserve
}

type MasonryWallType = InstanceType<typeof MasonryWall>

const TestComponent = defineComponent({
  template: '<masonry-wall :items="[1, 2, 3]" />',
})

describe('MasonryWall', () => {
  beforeAll(() => {
    console.warn = function (message) {
      throw message
    }
  })

  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', MockResizeObserver)
    window.scrollTo = vi.fn()
  })

  test('can be installed', async ({ expect }) => {
    Vue.use(MasonryWall)
    const wrapper = mount(TestComponent)
    await flushPromises()
    const wall = wrapper.find<HTMLDivElement>('.masonry-wall')
    expect(wall.element).toBeDefined()
    const items = wrapper.findAll('.masonry-item')
    expect(items.length).toEqual(3)
  })

  test('creates SSR columns', async ({ expect }) => {
    const wrapper = mount(MasonryWall, {
      propsData: {
        items: [1, 2],
        ssrColumns: 1,
      },
    })
    await flushPromises()
    const wall = wrapper.find<HTMLDivElement>('.masonry-wall')
    expect(wall.element).toBeDefined()
    const columns = wrapper.findAll('.masonry-column')
    expect(columns.length).toEqual(1)
    const items = wrapper.findAll('.masonry-item')
    expect(items.length).toEqual(2)
  })

  test('reacts to item changes', async ({ expect }) => {
    const wrapper = mount(MasonryWall, {
      propsData: {
        items: [1, 2],
      },
    })
    await flushPromises()
    const wall = wrapper.find<HTMLDivElement>('.masonry-wall')
    expect(wall.element).toBeDefined()
    const columns = wrapper.findAll('.masonry-column')
    expect(columns.length).toEqual(1)
    expect(wrapper.findAll('.masonry-item').length).toEqual(2)
    await wrapper.setProps({
      items: [1, 2, 3],
    })
    await flushPromises()
    expect(wrapper.findAll('.masonry-item').length).toEqual(3)
    await wrapper.setProps({
      items: [1],
    })
    await flushPromises()
    expect(wrapper.findAll('.masonry-item').length).toEqual(1)
  })

  test('unobserves the ResizeObserver', async ({ expect }) => {
    expect(mocks.ResizeObserver.observe).not.toHaveBeenCalled()
    const wrapper = mount(MasonryWall, {
      propsData: {
        items: [1, 2],
      },
    })
    await flushPromises()
    expect(mocks.ResizeObserver.observe).toHaveBeenCalledOnce()
    expect(mocks.ResizeObserver.unobserve).not.toHaveBeenCalled()
    wrapper.destroy()
    expect(mocks.ResizeObserver.unobserve).toHaveBeenCalledOnce()
  })

  test('reacts to column-width prop changes', async ({ expect }) => {
    const wrapper = mount<MasonryWallType>(MasonryWall, {
      propsData: {
        items: [1, 2],
      },
    })
    await flushPromises()
    expect(wrapper.emitted('redraw')?.length).toEqual(1)
    expect(wrapper.emitted('redraw-skip')).toBeUndefined()
    await wrapper.setProps({
      columnWidth: 300,
    })
    await flushPromises()
    expect(wrapper.emitted('redraw')?.length).toEqual(1)
    expect(wrapper.emitted('redraw-skip')?.length).toEqual(1)
  })

  test('reacts to gap prop changes', async ({ expect }) => {
    const wrapper = mount<MasonryWallType>(MasonryWall, {
      propsData: {
        items: [1, 2],
      },
    })
    await flushPromises()
    expect(wrapper.emitted('redraw')?.length).toEqual(1)
    expect(wrapper.emitted('redraw-skip')).toBeUndefined()
    await wrapper.setProps({
      gap: 42,
    })
    await flushPromises()
    expect(wrapper.emitted('redraw')?.length).toEqual(1)
    expect(wrapper.emitted('redraw-skip')?.length).toEqual(1)
  })

  test('reacts to rtl prop changes', async ({ expect }) => {
    const wrapper = mount<MasonryWallType>(MasonryWall, {
      propsData: {
        items: [1, 2],
      },
    })
    await flushPromises()
    expect(wrapper.emitted('redraw')?.length).toEqual(1)
    await wrapper.setProps({
      rtl: true,
    })
    await flushPromises()
    expect(wrapper.emitted('redraw')?.length).toEqual(2)
  })

  test('adds items to the smallest column', async ({ expect }) => {
    const wrapper = mount(MasonryWall, {
      propsData: {
        items: [],
        columnWidth: 100,
        gap: 0,
      },
    })
    await flushPromises()
    const wall = wrapper.find('.masonry-wall')
    wall.element.getBoundingClientRect = (): DOMRect => ({
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 300,
      x: 0,
      y: 0,
      toJSON(): string {
        return ''
      },
    })
    await wrapper.setProps({
      items: [1, 2],
    })
    await flushPromises()

    const [first, second, third] = wall.findAll('.masonry-column').wrappers
    expect(first?.element.childElementCount).toEqual(2)
    expect(second?.element.childElementCount).toEqual(0)
    expect(third?.element.childElementCount).toEqual(0)

    first!.element.getBoundingClientRect = (): DOMRect => ({
      bottom: 0,
      height: 500,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
      x: 0,
      y: 0,
      toJSON(): string {
        return ''
      },
    })
    third!.element.getBoundingClientRect = (): DOMRect => ({
      bottom: 0,
      height: 200,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
      x: 0,
      y: 0,
      toJSON(): string {
        return ''
      },
    })

    await wrapper.setProps({
      items: [1, 2, 3],
    })
    await flushPromises()

    const [firstNew, secondNew, thirdNew] = wall.findAll('.masonry-column').wrappers
    expect(firstNew?.element.childElementCount).toEqual(0)
    expect(secondNew?.element.childElementCount).toEqual(3)
    expect(thirdNew?.element.childElementCount).toEqual(0)
  })

  test('coerces with regards to maxColumns', async ({ expect }) => {
    const wrapper = mount(MasonryWall, {
      propsData: {
        items: [1, 2],
        columnWidth: 100,
      },
    })
    await flushPromises()
    const wall = wrapper.find<HTMLDivElement>('.masonry-wall')
    expect(wall.element).toBeDefined()
    wall.element.getBoundingClientRect = (): DOMRect => ({
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 1000,
      x: 0,
      y: 0,
      toJSON(): string {
        return ''
      },
    })
    await wrapper.setProps({
      items: [1, 2],
      maxColumns: 20,
    })
    await flushPromises()
    const unconstrainedColumns = wrapper.findAll('.masonry-column').wrappers
    expect(unconstrainedColumns.length).toEqual(10)

    await wrapper.setProps({
      items: [1, 2],
      maxColumns: 1,
    })
    await flushPromises()
    const columns = wrapper.findAll('.masonry-column').wrappers
    expect(columns.length).toEqual(1)
    const items = wrapper.findAll('.masonry-item').wrappers
    expect(items.length).toEqual(2)
  })
})
