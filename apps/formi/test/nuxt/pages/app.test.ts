import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, test, vi } from 'vitest'

import AppPage from '~/pages/app.vue' with { vfm: 'true' }

vi.mock('~/components/ModelGraph.vue', () => ({ default: { template: 'div />' } }))

describe('AppPage', () => {
  test('renders the app page', async ({ expect }) => {
    const wrapper = await mountSuspended(AppPage, {
      shallow: true,
      global: { renderStubDefaultSlot: true },
    })
    expect(wrapper.findAllComponents({ name: 'PaneTitle' })).toHaveLength(4)
  })
})
