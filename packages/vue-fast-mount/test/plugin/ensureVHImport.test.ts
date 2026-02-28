import { describe, test } from 'vitest'

import { ensureVueHImport } from '../../src/plugin/ensureVHImport'

describe('ensureVueHImport', () => {
  test('adds h import if missing', ({ expect }) => {
    const code = `import { defineComponent } from 'vue'\nconst x = 1`
    const transformed = ensureVueHImport(code)
    expect(transformed).toBe(`import { h } from 'vue'\n${code}`)
  })

  test('does not add duplicate h import', ({ expect }) => {
    const code = `import { defineComponent, h } from 'vue'\nconst x = 1`
    const transformed = ensureVueHImport(code)
    expect(transformed).toBe(code)
  })
})
