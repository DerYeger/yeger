import { describe, test } from 'vitest'

import { collectStaticImports } from '../../src/plugin/collectStaticImports'

describe('collectStaticImports', () => {
  test('collects top-level import statements with various formatting', ({ expect }) => {
    const scriptWithMultilineImport = `import {
  Alpha, /* Comment
*/  Beta,
} from './mod'
import Gamma from './gamma' /* Comment */
// Comment
import type /* inline comment */ { TypeOnly } from './types' // Comment
const local = 1
import './side-effect'
/** evil comment */ import Delta from './delta' // This is a comment
import Main, { child as /* comment */ CommentedChild } from './commented'
import {
  /** some comment */ BarrelChild as /** inline comment */ AliasedBarrelChild,
} from './barrel'
import MixedDefaultChild /** another comment */, {
  BarrelChild as MixedNamedChild,
} from './mixedBarrel'
import Sibling from './Sibling.vue'`

    const statements = collectStaticImports(scriptWithMultilineImport)
    expect(statements).toMatchInlineSnapshot(`
      [
        {
          "end": 53,
          "start": 0,
          "statement": "import {
        Alpha, /* Comment
      */  Beta,
      } from './mod'",
        },
        {
          "end": 95,
          "start": 54,
          "statement": "import Gamma from './gamma' /* Comment */",
        },
        {
          "end": 178,
          "start": 107,
          "statement": "import type /* inline comment */ { TypeOnly } from './types' // Comment",
        },
        {
          "end": 217,
          "start": 195,
          "statement": "import './side-effect'",
        },
        {
          "end": 286,
          "start": 218,
          "statement": "/** evil comment */ import Delta from './delta' // This is a comment",
        },
        {
          "end": 360,
          "start": 287,
          "statement": "import Main, { child as /* comment */ CommentedChild } from './commented'",
        },
        {
          "end": 466,
          "start": 361,
          "statement": "import {
        /** some comment */ BarrelChild as /** inline comment */ AliasedBarrelChild,
      } from './barrel'",
        },
        {
          "end": 574,
          "start": 467,
          "statement": "import MixedDefaultChild /** another comment */, {
        BarrelChild as MixedNamedChild,
      } from './mixedBarrel'",
        },
        {
          "end": 610,
          "start": 575,
          "statement": "import Sibling from './Sibling.vue'",
        },
      ]
    `)
  })
})
