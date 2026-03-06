import type { TransformResult } from 'vite'
import { parse } from 'vue/compiler-sfc'

import { analyzeTemplate } from './analyzeTemplate'
import { getUnstubbedComponents } from './getUnstubbedComponent'
import { shouldTransformSFC } from './shouldTransformSFC'
import { transformScriptSetup } from './transformScriptSetup'

export function transformSFC(code: string, id: string): TransformResult | null {
  const queryIndex = id.indexOf('?')
  if (queryIndex === -1) {
    return null
  }

  const params = new URLSearchParams(id.slice(queryIndex + 1))
  if (!shouldTransformSFC(params)) {
    return null
  }

  const descriptor = parse(code).descriptor
  if (!descriptor.template || !descriptor.scriptSetup) {
    return null
  }

  const unstubbedComponents = getUnstubbedComponents(params)

  const components = analyzeTemplate(id, descriptor.template, unstubbedComponents)
  if (components.size === 0) {
    return null
  }

  return transformScriptSetup(code, id.slice(0, queryIndex), descriptor.scriptSetup, components)
}
