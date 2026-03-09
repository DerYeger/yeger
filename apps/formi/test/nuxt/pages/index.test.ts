import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, test } from 'vitest'

import LandingPage from '~/pages/index.vue' with { vfm: 'true' }

describe('LandingPage', () => {
  test('renders the landing page', async ({ expect }) => {
    const wrapper = await mountSuspended(LandingPage, { shallow: true })
    expect(wrapper.findAllComponents({ name: 'HeroProse' })).toHaveLength(2)
  })
})
