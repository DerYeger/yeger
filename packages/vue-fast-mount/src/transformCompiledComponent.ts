import { readFileSync } from 'node:fs'

import { generate } from '@babel/generator'
import type { TransformResult } from 'vite'
import { babelParse, parse } from 'vue/compiler-sfc'

import { analyzeTemplate } from './analyzeTemplate'
import { getUnstubbedComponents } from './getUnstubbedComponent'
import { insertComponentStubs } from './insertComponentStubs'
import { removeStubbedComponentImports } from './removeStubbedComponentImports'
import { shouldTransformSFC } from './shouldTransformSFC'

export function transformCompiledComponent(code: string, id: string): TransformResult | null {
  const parsedId = parseCompiledScriptId(id)
  if (!parsedId) {
    return null
  }

  const { filename, params } = parsedId
  if (!shouldTransformSFC(params)) {
    return null
  }

  const descriptor = readSFCDescriptor(filename)
  if (!descriptor?.template || !descriptor.scriptSetup) {
    return null
  }

  const unstubbedComponents = getUnstubbedComponents(params)
  const components = analyzeTemplate(filename, descriptor.template, unstubbedComponents)
  if (components.size === 0) {
    return null
  }

  const ast = babelParse(code, {
    sourceType: 'module',
    plugins: ['typescript'],
  })

  removeStubbedComponentImports(ast, components)
  insertComponentStubs(ast, components)

  const output = generate(
    ast,
    {
      sourceMaps: true,
      sourceFileName: id,
    },
    code,
  )

  return {
    code: output.code,
    map: output.map ? toSourceMap(output.map) : null,
  }
}

function toSourceMap(
  map: NonNullable<ReturnType<typeof generate>['map']>,
): NonNullable<TransformResult['map']> {
  return {
    ...map,
    toString: () => JSON.stringify(map),
    toUrl: () =>
      `data:application/json;charset=utf-8;base64,${Buffer.from(JSON.stringify(map)).toString('base64')}`,
  }
}

function parseCompiledScriptId(id: string): { filename: string; params: URLSearchParams } | null {
  const queryIndex = id.indexOf('?')
  if (queryIndex === -1) {
    return null
  }

  const params = new URLSearchParams(id.slice(queryIndex + 1))
  if (params.has('type') && params.get('type') !== 'script') {
    return null
  }

  return {
    filename: id.slice(0, queryIndex),
    params,
  }
}

function readSFCDescriptor(id: string): ReturnType<typeof parse>['descriptor'] | null {
  let filePath = decodeURIComponent(id)
  if (filePath.startsWith('/@fs/')) {
    filePath = filePath.slice('/@fs'.length)
  }
  if (/^\/[A-Za-z]:\//.test(filePath)) {
    filePath = filePath.slice(1)
  }

  try {
    const source = readFileSync(filePath, 'utf-8')
    return parse(source, { filename: filePath }).descriptor
  } catch {
    return null
  }
}
