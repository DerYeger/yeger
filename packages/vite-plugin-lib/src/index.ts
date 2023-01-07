import { readFile } from 'fs/promises'
import { builtinModules } from 'module'
import path from 'path'

import c from 'picocolors'
import type { CompilerOptions } from 'typescript'
import {
  parseConfigFileTextToJson,
  parseJsonConfigFileContent,
  sys,
} from 'typescript'
import type { Alias, AliasOptions, LibraryFormats, Plugin } from 'vite'
import dts from 'vite-plugin-dts'

export * as dts from 'vite-plugin-dts'

function log(text: string) {
  // eslint-disable-next-line no-console
  console.log(`${c.cyan('[vite:lib]')} ${text}`)
}

function logError(text: string) {
  console.error(`${c.red('[vite:lib]')} ${text}`)
}

export interface Options {
  name: string
  entry: string
  formats?: LibraryFormats[]
  externalPackages?: (string | RegExp)[]
}

export const tsconfigPaths = (): Plugin => {
  return {
    name: 'vite-plugin-lib:alias',
    enforce: 'pre',
    config: async (config) => {
      const tsconfigPath = path.resolve(config.root ?? '.', 'tsconfig.json')
      const { baseUrl, paths } = await readConfig(tsconfigPath)
      if (!baseUrl || !paths) {
        return config
      }
      const aliasOptions: Alias[] = Object.entries(paths).map(
        ([alias, replacement]) => ({
          find: alias.replace('/*', ''),
          replacement: path.resolve(
            tsconfigPath,
            baseUrl,
            replacement[0].replace('/*', '')
          ),
        })
      )
      if (aliasOptions.length > 0) {
        log(`Injected ${c.green(aliasOptions.length)} aliases.`)
        const base = `${path.resolve(config.root ?? '.')}/`
        aliasOptions
          .map(
            ({ find, replacement }) =>
              `${c.gray('>')} ${c.green(find.toString())} ${c.gray(
                c.bold('->')
              )} ${c.green(replacement.replace(base, ''))}`
          )
          .forEach(log)
      }
      const existingAlias = transformExistingAlias(config.resolve?.alias)
      return {
        ...config,
        resolve: {
          ...config.resolve,
          alias: [...existingAlias, ...aliasOptions],
        },
      }
    },
  }
}

const buildConfig = ({
  entry,
  formats,
  name,
  externalPackages,
}: Options): Plugin => {
  if (!externalPackages) {
    log('Externalized all packages.')
  }
  return {
    name: 'vite-plugin-lib:build',
    enforce: 'pre',
    config: async (config) => {
      return {
        ...config,
        build: {
          ...config.build,
          lib: {
            ...config.build?.lib,
            entry: path.resolve(config.root ?? '.', entry),
            formats,
            name,
            fileName: (format: string) => formatToFileName(entry, format),
          },
          rollupOptions: {
            external: externalPackages ?? [/node_modules/, ...builtinModules],
          },
        },
      }
    },
  }
}

function formatToFileName(entry: string, format: string): string {
  const entryFileName = entry.substring(
    entry.lastIndexOf('/') + 1,
    entry.lastIndexOf('.')
  )
  if (format === 'es') {
    return `${entryFileName}.mjs`
  }
  if (format === 'cjs') {
    return `${entryFileName}.cjs`
  }
  return `${entryFileName}.${format}.js`
}

export function library(options: Options): Plugin[] {
  return [
    tsconfigPaths(),
    buildConfig(options),
    dts({
      cleanVueFileName: true,
      include: `${path.resolve(options.entry, '..')}**`,
      outputDir: 'dist/types',
      staticImport: true,
    }),
  ]
}

function transformExistingAlias(alias: AliasOptions | undefined): Alias[] {
  if (!alias) {
    return []
  }
  if (Array.isArray(alias)) {
    return alias
  }
  return Object.entries(alias).map(([find, replacement]) => ({
    find,
    replacement,
  }))
}

async function readConfig(configPath: string): Promise<CompilerOptions> {
  try {
    const configFileText = await readFile(configPath, { encoding: 'utf-8' })
    const { config } = parseConfigFileTextToJson(configPath, configFileText)
    if (!('baseUrl' in config?.compilerOptions)) {
      throw new Error('No baseUrl provided in tsconfig.json.')
    }
    const { options } = parseJsonConfigFileContent(
      config,
      sys,
      path.dirname(configPath)
    )
    return options
  } catch (error: any) {
    const message = 'message' in error ? error.message : error
    logError(`Could not read tsconfig.json: ${message}`)
    throw error
  }
}
