import { generate } from '@babel/generator'
import type { TransformResult } from 'vite'
import { babelParse, MagicString, type SFCScriptBlock } from 'vue/compiler-sfc'

import { insertComponentStubs } from './insertComponentStubs'
import { removeStubbedComponentImports } from './removeStubbedComponentImports'
import type { Components } from './utils'

export function transformScriptSetup(
  code: string,
  scriptSetup: SFCScriptBlock,
  components: Components,
): TransformResult {
  const sfcCode = new MagicString(code)

  const ast = babelParse(scriptSetup.content, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
  })

  removeStubbedComponentImports(ast, components)
  insertComponentStubs(ast, components)

  const newScript = generate(ast).code
  sfcCode.overwrite(scriptSetup.loc.start.offset, scriptSetup.loc.end.offset, `\n${newScript}\n`)

  return {
    code: sfcCode.toString(),
    map: sfcCode.generateMap({ hires: true }),
  }
}
