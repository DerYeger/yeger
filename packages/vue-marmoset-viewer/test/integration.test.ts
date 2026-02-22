import { flushPromises, mount } from '@vue/test-utils'
import { beforeAll, describe, test } from 'vitest'
import { defineComponent, resolveComponent, h } from 'vue'

import { MarmosetViewer } from '../src/index'

const TestComponent = defineComponent({
  render() {
    const MarmosetViewerComponent = resolveComponent('marmoset-viewer')
    return h(MarmosetViewerComponent, { src: 'test.mview' })
  },
})

describe('MarmosetViewer', () => {
  beforeAll(() => {
    console.warn = function (message) {
      console.error(message)
      throw message
    }
  })

  test('can be installed', async ({ expect }) => {
    const wrapper = mount(TestComponent, {
      global: {
        plugins: [MarmosetViewer],
      },
    })
    await flushPromises()
    expect(wrapper.find('.marmoset-viewer-host')).toBeDefined()
  })
})
