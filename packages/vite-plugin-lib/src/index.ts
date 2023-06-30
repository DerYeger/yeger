import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { builtinModules } from 'node:module'
import path from 'node:path'

import c from 'picocolors'
import type { CompilerOptions } from 'typescript'
import ts from 'typescript'
import type {
  Alias,
  AliasOptions,
  LibraryFormats,
  Plugin,
  UserConfig,
} from 'vite'
import dts from 'vite-plugin-dts'

export * as dts from 'vite-plugin-dts'

function log(text: string) {
  // eslint-disable-next-line no-console
  console.log(`${c.cyan('[vite:lib]')} ${text}`)
}

function logWarn(text: string) {
  console.warn(`${c.yellow('[vite:lib]')} ${text}`)
}

function logError(text: string) {
  console.error(`${c.red('[vite:lib]')} ${text}`)
}

export interface Options {
  name: string
  entry: string
  formats?: LibraryFormats[]
  externalPackages?: (string | RegExp)[]
  verbose?: boolean
}

export function tsconfigPaths({ verbose }: Partial<Options> = {}): Plugin {
  return {
    name: 'vite-plugin-lib:alias',
    enforce: 'pre',
    config: async (config) => {
      const tsconfigPath = path.resolve(config.root ?? '.', 'tsconfig.json')
      const { baseUrl, paths } = await readConfig(tsconfigPath)
      if (!baseUrl || !paths) {
        log('No paths found in tsconfig.json.')
        return config
      }
      const pathToAlias = pathToAliasFactory(tsconfigPath, baseUrl, verbose)
      const aliasOptions = Object.entries(paths)
        .map(pathToAlias)
        .filter(Boolean) as Alias[]
      if (aliasOptions.length > 0) {
        logInjectedAliases(aliasOptions, config, verbose)
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

function buildConfig({
  entry,
  formats,
  name,
  externalPackages,
}: Options): Plugin {
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

function logInjectedAliases(
  aliasOptions: Alias[],
  config: UserConfig,
  verbose?: boolean
) {
  log(`Injected ${c.green(aliasOptions.length)} aliases.`)
  if (!verbose) {
    return
  }
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

function pathToAliasFactory(
  tsconfigPath: string,
  baseUrl: string,
  verbose?: boolean
): (path: [string, string[]]) => Alias | undefined {
  return ([alias, replacements]) => {
    if (replacements.length === 0) {
      if (verbose) {
        logWarn(`No replacements for alias ${c.green(alias)}.`)
      }
      return undefined
    }
    if (verbose && replacements.length > 1) {
      logWarn(`Found more than one replacement for alias ${c.green(alias)}.`)
      logWarn('Using the first existing replacement.')
    }
    const find = alias.replace('/*', '')
    const replacement = getFirstExistingReplacement(
      tsconfigPath,
      baseUrl,
      replacements,
      find
    )
    if (!replacement) {
      if (verbose) {
        logWarn(`No replacement found for alias ${c.green(alias)}.`)
      }
      return undefined
    }
    return {
      find,
      replacement,
    }
  }
}

function getFirstExistingReplacement(
  tsconfigPath: string,
  baseUrl: string,
  replacements: string[],
  find: string,
  verbose?: boolean
): string | undefined {
  for (const replacement of replacements) {
    const resolvedReplacement = path.resolve(
      tsconfigPath,
      baseUrl,
      replacement.replace('/*', '') ?? find
    )
    if (existsSync(resolvedReplacement)) {
      return resolvedReplacement
    } else if (verbose) {
      logWarn(`Path ${c.green(replacement)} does not exist.`)
    }
  }
  return undefined
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
      copyDtsFiles: true,
      include: `${path.resolve(options.entry, '..')}/**`,
      outDir: 'dist/types',
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
    // eslint-disable-next-line import/no-named-as-default-member
    const { config } = ts.parseConfigFileTextToJson(configPath, configFileText)
    if (!('baseUrl' in config?.compilerOptions)) {
      throw new Error('No baseUrl provided in tsconfig.json.')
    }
    // eslint-disable-next-line import/no-named-as-default-member
    const { options } = ts.parseJsonConfigFileContent(
      config,
      // eslint-disable-next-line import/no-named-as-default-member
      ts.sys,
      path.dirname(configPath)
    )
    return options
  } catch (error: any) {
    const message = 'message' in error ? error.message : error
    logError(`Could not read tsconfig.json: ${message}`)
    throw error
  }
}
