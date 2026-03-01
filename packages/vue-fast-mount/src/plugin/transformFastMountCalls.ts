import type { NodePath } from '@babel/traverse'
import type { ArgumentPlaceholder, Expression, ObjectExpression, SpreadElement } from '@babel/types'
import * as t from '@babel/types'
import type { TransformResult } from 'vite'
import { MagicString, babelParse } from 'vue/compiler-sfc'

import {
  FAST_MOUNT_UNSTUB_QUERY_KEY,
  FAST_MOUNT_QUERY_KEY,
  FAST_MOUNT_QUERY_VALUE,
  traverse,
} from './utils'

export function transformFastMountCalls(code: string): TransformResult | null {
  const ast = parseCode(code)
  if (!ast) {
    return null
  }

  const fastMountBindingNames = collectFastMountBindingNames(ast)

  const magicString = new MagicString(code)
  let changed = false

  traverse(ast, {
    CallExpression(path) {
      if (!isFastMountCallee(path, fastMountBindingNames)) {
        return
      }

      const [componentArgument, mountOptions] = path.node.arguments
      const dynamicImport = getDynamicImportArgument(componentArgument)
      if (!dynamicImport || !t.isStringLiteral(dynamicImport)) {
        return
      }

      const unstubbedComponents = extractExplicitlyUnstubbedComponents(mountOptions)
      const rewrittenSpecifier = appendFastMountQuery(dynamicImport.value, unstubbedComponents)
      if (rewrittenSpecifier === dynamicImport.value) {
        return
      }

      overwriteStringLiteral(code, magicString, dynamicImport, rewrittenSpecifier)
      changed = true
    },
  })

  if (!changed) {
    return null
  }

  return {
    code: magicString.toString(),
    map: magicString.generateMap({ hires: true }),
  }
}

function parseCode(code: string) {
  try {
    return babelParse(code, {
      sourceType: 'unambiguous',
      plugins: ['typescript', 'jsx'],
    })
  } catch {
    return null
  }
}

function collectFastMountBindingNames(ast: t.File): Set<string> {
  const bindingNames = new Set<string>()

  for (const statement of ast.program.body) {
    if (!t.isImportDeclaration(statement) || statement.source.value !== 'vue-fast-mount') {
      continue
    }

    for (const specifier of statement.specifiers) {
      if (
        t.isImportSpecifier(specifier) &&
        t.isIdentifier(specifier.imported, { name: 'fastMount' })
      ) {
        bindingNames.add(specifier.local.name)
      }
    }
  }

  return bindingNames
}

function isFastMountCallee(
  path: NodePath<t.CallExpression>,
  fastMountBindingNames: Set<string>,
): boolean {
  if (!t.isIdentifier(path.node.callee)) {
    return false
  }

  const calleeName = path.node.callee.name
  if (calleeName !== 'fastMount' && !fastMountBindingNames.has(calleeName)) {
    return false
  }

  const binding = path.scope.getBinding(calleeName)

  if (!binding) {
    return calleeName === 'fastMount'
  }

  if (!binding.path.isImportSpecifier()) {
    return false
  }

  const importSpecifier = binding.path.node
  if (!t.isIdentifier(importSpecifier.imported) || importSpecifier.imported.name !== 'fastMount') {
    return false
  }

  const importDeclaration = binding.path.parentPath.node
  return (
    t.isImportDeclaration(importDeclaration) && importDeclaration.source.value === 'vue-fast-mount'
  )
}

function getDynamicImportArgument(
  argument: Expression | SpreadElement | ArgumentPlaceholder | undefined,
): t.StringLiteral | null {
  if (!argument || t.isSpreadElement(argument) || t.isArgumentPlaceholder(argument)) {
    return null
  }

  if (t.isImportExpression(argument) && t.isStringLiteral(argument.source)) {
    return argument.source
  }

  if (
    t.isCallExpression(argument) &&
    t.isImport(argument.callee) &&
    argument.arguments.length > 0 &&
    t.isStringLiteral(argument.arguments[0])
  ) {
    return argument.arguments[0]
  }

  return null
}

function overwriteStringLiteral(
  code: string,
  magicString: MagicString,
  literal: t.StringLiteral,
  value: string,
): void {
  if (literal.start == null || literal.end == null) {
    return
  }

  const raw = code.slice(literal.start, literal.end)
  const quote = raw[0] === "'" || raw[0] === '"' ? raw[0] : '"'
  magicString.overwrite(literal.start, literal.end, quoteString(value, quote))
}

function quoteString(value: string, quote: string): string {
  let escaped = value
    .replaceAll('\\', '\\\\')
    .replaceAll('\r', '\\r')
    .replaceAll('\n', '\\n')
    .replaceAll('\u2028', '\\u2028')
    .replaceAll('\u2029', '\\u2029')

  if (quote === "'") {
    escaped = escaped.replaceAll("'", "\\'")
  } else {
    escaped = escaped.replaceAll('"', '\\"')
  }

  return `${quote}${escaped}${quote}`
}

function appendFastMountQuery(specifier: string, unstubbedComponents: Set<string>): string {
  if (!specifier.includes('.vue')) {
    return specifier
  }

  const hashIndex = specifier.indexOf('#')
  const hash = hashIndex === -1 ? '' : specifier.slice(hashIndex)
  const base = hashIndex === -1 ? specifier : specifier.slice(0, hashIndex)

  const separator = base.includes('?') ? '&' : '?'
  const unstubQuery = unstubbedComponents.size
    ? `&${FAST_MOUNT_UNSTUB_QUERY_KEY}=${encodeURIComponent([...unstubbedComponents].join(','))}`
    : ''

  return `${base}${separator}${FAST_MOUNT_QUERY_KEY}=${FAST_MOUNT_QUERY_VALUE}${unstubQuery}${hash}`
}

function extractExplicitlyUnstubbedComponents(
  mountOptions: Expression | SpreadElement | ArgumentPlaceholder | undefined,
): Set<string> {
  if (!mountOptions || t.isSpreadElement(mountOptions) || t.isArgumentPlaceholder(mountOptions)) {
    return new Set()
  }

  if (!t.isObjectExpression(mountOptions)) {
    return new Set()
  }

  const componentNames = new Set<string>()
  collectUnstubbedComponentsFromMountOptions(mountOptions, componentNames)

  return componentNames
}

function collectUnstubbedComponentsFromMountOptions(
  expression: ObjectExpression,
  componentNames: Set<string>,
): void {
  for (const property of expression.properties) {
    if (!t.isObjectProperty(property) || property.computed) {
      continue
    }

    if (getObjectKeyName(property.key) === 'global' && t.isObjectExpression(property.value)) {
      collectUnstubbedComponentsFromGlobalOptions(property.value, componentNames)
      break
    }
  }
}

function collectUnstubbedComponentsFromGlobalOptions(
  expression: ObjectExpression,
  componentNames: Set<string>,
): void {
  for (const property of expression.properties) {
    if (!t.isObjectProperty(property) || property.computed) {
      continue
    }

    if (getObjectKeyName(property.key) === 'stubs' && t.isObjectExpression(property.value)) {
      collectLiteralFalseStubs(property.value, componentNames)
      break
    }
  }
}

function collectLiteralFalseStubs(
  stubsObject: ObjectExpression,
  componentNames: Set<string>,
): void {
  for (const property of stubsObject.properties) {
    if (!t.isObjectProperty(property)) {
      continue
    }

    if (property.computed || !t.isBooleanLiteral(property.value, { value: false })) {
      continue
    }

    const componentName = getObjectKeyName(property.key)
    if (componentName) {
      componentNames.add(componentName)
    }
  }
}

function getObjectKeyName(key: t.Expression | t.Identifier | t.PrivateName): string | null {
  if (t.isIdentifier(key)) {
    return key.name
  }

  if (t.isStringLiteral(key)) {
    return key.value
  }

  return null
}
