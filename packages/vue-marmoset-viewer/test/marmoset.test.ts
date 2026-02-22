import { describe, test } from 'vitest'

import { loadMarmoset, marmosetScriptId } from '../src/marmoset'

describe('Marmoset', () => {
  test('loads the Marmoset script exactly once', async ({ expect }) => {
    const getScripts = () => document.head.getElementsByTagName('script')
    const getScriptCount = () => getScripts().length
    const initialScriptCount = getScriptCount()

    const assertScripts = () => {
      const scripts = document.head.getElementsByTagName('script')
      expect(scripts.length).toBe(initialScriptCount + 1)
      expect(scripts[scripts.length - 1]?.id).toEqual(marmosetScriptId)
    }

    const first = loadMarmoset()
    const second = loadMarmoset()
    document.getElementById(marmosetScriptId)?.dispatchEvent(new Event('load'))
    await Promise.all([first, second])
    assertScripts()

    await loadMarmoset()
    assertScripts()
  })
})
