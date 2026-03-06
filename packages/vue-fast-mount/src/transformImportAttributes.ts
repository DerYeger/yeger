import { generate } from '@babel/generator'
import * as t from '@babel/types'
import type { TransformResult } from 'vite'
import { babelParse, MagicString } from 'vue/compiler-sfc'

import {
  FAST_MOUNT_QUERY_KEY,
  FAST_MOUNT_QUERY_VALUE,
  FAST_MOUNT_UNSTUB_QUERY_KEY,
  traverse,
} from './utils'

export const VFM_IMPORT_ATTRIBUTE_NAME = 'vfm'

export function transformImportAttributes(code: string, id: string): TransformResult | null {
  const sfcCode = new MagicString(code)

  let ast
  try {
    ast = babelParse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx', 'importAttributes'],
    })
  } catch {
    return null
  }

  let changed = false

  traverse(ast, {
    ImportDeclaration(path) {
      if (typeof path.node.source.value !== 'string' || !path.node.source.value.includes('.vue')) {
        return
      }

      const attributes = path.node.attributes
      if (!attributes?.length) {
        return
      }

      const remainingAttributes: t.ImportAttribute[] = []
      let unstubbedComponents: Set<string> | null = null

      for (const attribute of attributes) {
        if (!isVfmAttribute(attribute)) {
          remainingAttributes.push(attribute)
          continue
        }

        unstubbedComponents = parseVfmValue(attribute.value)
        if (!unstubbedComponents) {
          return
        }
      }

      if (!unstubbedComponents) {
        return
      }

      path.node.source.value = appendFastMountQuery(path.node.source.value, unstubbedComponents)
      path.node.attributes = remainingAttributes

      const start = path.node.start
      const end = path.node.end

      if (start == null || end == null) {
        return
      }

      const rewrittenImport = generate(path.node, {
        importAttributesKeyword: 'with',
        jsescOption: { quotes: 'single' },
      }).code
      sfcCode.overwrite(start, end, rewrittenImport)
      changed = true
    },
  })

  if (!changed) {
    return null
  }

  return {
    code: sfcCode.toString(),
    map: sfcCode.generateMap({ hires: true, source: id, includeContent: true }),
  }
}

function isVfmAttribute(attribute: t.ImportAttribute): boolean {
  if (t.isIdentifier(attribute.key)) {
    return attribute.key.name === VFM_IMPORT_ATTRIBUTE_NAME
  }

  if (t.isStringLiteral(attribute.key)) {
    return attribute.key.value === VFM_IMPORT_ATTRIBUTE_NAME
  }

  return false
}

function parseVfmValue(value: t.Expression): Set<string> | null {
  if (!t.isStringLiteral(value)) {
    return null
  }

  const stripped = value.value
  if (stripped === 'true') {
    return new Set()
  }

  const names = stripped
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)

  return new Set(names)
}

function appendFastMountQuery(specifier: string, unstubbedComponents: Set<string>): string {
  const hashIndex = specifier.indexOf('#')
  const hash = hashIndex === -1 ? '' : specifier.slice(hashIndex)
  const base = hashIndex === -1 ? specifier : specifier.slice(0, hashIndex)

  const url = new URL(base, 'file:///')
  url.searchParams.set(FAST_MOUNT_QUERY_KEY, FAST_MOUNT_QUERY_VALUE)

  if (unstubbedComponents.size) {
    url.searchParams.set(FAST_MOUNT_UNSTUB_QUERY_KEY, [...unstubbedComponents].join(','))
  }

  const rewrittenBase = toRawSpecifier(base, url.search)
  return `${rewrittenBase}${hash}`
}

function toRawSpecifier(originalSpecifier: string, search: string): string {
  const queryIndex = originalSpecifier.indexOf('?')
  const path = queryIndex === -1 ? originalSpecifier : originalSpecifier.slice(0, queryIndex)

  return `${path}${search}`
}
