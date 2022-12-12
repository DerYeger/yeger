import { describe, expect, it } from 'vitest'

import { loadMarmoset, marmosetScriptId } from '~/marmoset'

function testScript() {
  const scripts = document.head.getElementsByTagName('script')
  expect(scripts.length).toBe(1)
  expect(scripts[0].id).toEqual(marmosetScriptId)
}

describe('Marmoset', () => {
  it('loads the Marmoset script exactly once', async () => {
    expect(document.head.getElementsByTagName('script').length).toBe(0)
    const first = loadMarmoset()
    const second = loadMarmoset()
    document.getElementById(marmosetScriptId)?.dispatchEvent(new Event('load'))
    await Promise.all([first, second])
    testScript()
    await loadMarmoset()
    testScript()
  })
})
