import * as s from '@yeger/streams/sync'

import { getComponentsFromTemplate } from './getComponentsFromTemplate'
import { omitStubbedComponentImports } from './omitStubbedComponentImports'

export function transformSFC(code: string, unstubbedComponents: Set<string>): string {
  const scriptMatcher = /<script\b([^>]*)>([\s\S]*?)<\/script>/g
  const scriptMatch = s.last(
    s.pipe(
      code.matchAll(scriptMatcher),
      s.filter((currentMatch) => currentMatch[1]?.includes('setup') ?? false),
    ),
  )
  if (!scriptMatch) {
    return code
  }

  const originalScript = scriptMatch[2]
  if (!originalScript) {
    return code
  }

  const components = getComponentsFromTemplate(code, unstubbedComponents)
  if (!components.size) {
    return code
  }

  const transformedScript = omitStubbedComponentImports(originalScript, components)
  if (transformedScript === originalScript) {
    return code
  }

  const fullMatch = scriptMatch[0]
  const scriptIndex = scriptMatch.index ?? 0
  const scriptContentStart = scriptIndex + fullMatch.indexOf(originalScript)
  const scriptContentEnd = scriptContentStart + originalScript.length

  return `${code.slice(0, scriptContentStart)}${transformedScript}${code.slice(scriptContentEnd)}`
}
