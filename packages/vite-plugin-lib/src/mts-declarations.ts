import { readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { normalizePath } from 'vite'

import { log } from './logger'

export async function generateMTSDeclarations(typesDir: string) {
  const files = await collectFiles(typesDir)
  for (const file of files) {
    await createMTSImports(file)
  }
  log(`Generated ${files.length} MTS declarations.`)
}

async function collectFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, {
    recursive: false, // does not provide full path to nested files
    withFileTypes: true,
  })
  const files = entries.filter((entry) => entry.isFile())
  const nestedFiles = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => collectFiles(normalizePath(path.join(dir, entry.name)))),
  )
  return files
    .map((file) => normalizePath(path.join(dir, file.name)))
    .concat(...nestedFiles)
}

async function createMTSImports(file: string) {
  const content = await readFile(file, 'utf-8')
  const lines = content.split('\n')
  const modified = lines.map(transformLine)
  const targetFile = file.replace('.d.ts', '.d.mts')
  await writeFile(targetFile, modified.join('\n'))
}

function transformLine(line: string) {
  const isStaticImport = line.includes('import ') && line.includes(`from '.`)
  if (isStaticImport) {
    return `${line.substring(0, line.length - 2)}.d.mts';`
  }
  const isStaticExport = line.includes('export ') && line.includes(` from '.`)
  if (isStaticExport) {
    return `${line.substring(0, line.length - 2)}.mjs';`
  }
  return line
}
