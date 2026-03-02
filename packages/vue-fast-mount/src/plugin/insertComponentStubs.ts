import * as t from '@babel/types'
import * as s from '@yeger/streams/sync'

import { type ComponentMetadata, type Components, type ParseResult } from './utils'

export function insertComponentStubs(ast: ParseResult, components: Components): void {
  for (const [componentName, data] of components) {
    ast.program.body.push(createComponentStub(componentName, data))
  }
}

function createComponentStub(name: string, data: ComponentMetadata): t.VariableDeclaration {
  const componentIdentifier = name
  const properties: (t.ObjectProperty | t.ObjectMethod)[] = [
    t.objectProperty(t.identifier('name'), t.stringLiteral(componentIdentifier)),
  ]

  const propsPart = createPropsDefinition(data.props)
  if (propsPart) {
    properties.push(propsPart)
  }
  const emitsPart = createEmitsDefinition(data.emits)
  if (emitsPart) {
    properties.push(emitsPart)
  }

  return t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier(componentIdentifier), t.objectExpression([...properties])),
  ])
}

function createPropsDefinition(props: ComponentMetadata['props']): t.ObjectProperty | undefined {
  if (!props.size) {
    return undefined
  }
  const propLiterals = s.toArray(
    s.pipe(
      props,
      s.filter(([prop]) => isPropCandidate(prop)),
      s.map(([prop, type]) =>
        t.objectProperty(
          t.stringLiteral(prop),
          type === 'boolean' ? t.identifier('Boolean') : t.nullLiteral(),
        ),
      ),
    ),
  )
  return t.objectProperty(t.identifier('props'), t.objectExpression(propLiterals))
}

function createEmitsDefinition(emits: ComponentMetadata['emits']): t.ObjectProperty | undefined {
  if (!emits.size) {
    return undefined
  }
  const emitLiterals = s.toArray(
    s.pipe(
      emits,
      s.map((emit) => t.stringLiteral(emit)),
    ),
  )
  return t.objectProperty(t.identifier('emits'), t.arrayExpression(emitLiterals))
}

const reservedNames = new Set(['key', 'ref', 'is'])
function isPropCandidate(propName: string): boolean {
  if (reservedNames.has(propName)) {
    return false
  }
  return !propName.startsWith('data-') && !propName.startsWith('aria-')
}
