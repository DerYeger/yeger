import * as t from '@babel/types'

import type { Components } from './utils'
import { traverse, type ParseResult } from './utils'

export function removeStubbedComponentImports(ast: ParseResult, components: Components): void {
  traverse(ast, {
    ImportDeclaration(path) {
      const specifiersToKeep = path.node.specifiers.filter((spec) => {
        // Default import
        if (t.isImportDefaultSpecifier(spec)) {
          return !components.has(spec.local.name)
        }

        // Named import
        if (t.isImportSpecifier(spec)) {
          return !components.has(spec.local.name)
        }

        // Namespace import
        if (t.isImportNamespaceSpecifier(spec)) {
          // remove only if namespace name matches
          return !components.has(spec.local.name)
        }

        return true
      })

      if (specifiersToKeep.length === 0) {
        // Remove entire import
        path.remove()
      } else if (specifiersToKeep.length < path.node.specifiers.length) {
        // Keep only remaining specifiers
        path.node.specifiers = specifiersToKeep
      }
    },
  })
}
