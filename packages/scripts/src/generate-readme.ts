import { writeFile } from 'node:fs/promises'
import process from 'node:process'

import type { Package } from '@manypkg/get-packages'
import { getPackages } from '@manypkg/get-packages'

export async function generateReadme(): Promise<void> {
  const { packages, rootPackage } = await getPackages(process.cwd())
  const packagesByType = groupBy(
    packages,
    (pkg) => pkg.relativeDir.split('/')[0] ?? 'other',
  )
  const output = Object.entries(packagesByType)
    .map(([type, pkgs]) => createSection(type, pkgs))
    .join('\n\n')
  const readme = `${createHeader(rootPackage)}\n\n${output}\n`
  await writeFile('README.md', readme)
}

function createHeader(rootPackage: Package | undefined) {
  if (!rootPackage) {
    return ''
  }
  const name = rootPackage.packageJson.name
  const description = (rootPackage.packageJson as any).description ?? ''
  if (!description) {
    return `# ${name}`
  }
  return `# ${name}\n\n> ${description}`
}

function createSection(type: string, pkgs: Package[]) {
  const packageLines = pkgs
    .sort((a, b) => a.packageJson.name.localeCompare(b.packageJson.name))
    .map(createPackageLine)
    .join('\n')
  return `## ${toTypeHeader(type)}\n\n${packageLines}`
}

function toTypeHeader(type: string) {
  return type[0]!.toUpperCase() + type.slice(1)
}

function createPackageLine(pkg: Package) {
  const url = `./${pkg.relativeDir}`
  return `- [${pkg.packageJson.name}](${url})`
}

function groupBy<T>(items: T[], key: (item: T) => string): Record<string, T[]> {
  return items.reduce(
    (acc, item) => {
      const group = key(item)
      if (!acc[group]) {
        acc[group] = []
      }
      acc[group]?.push(item)
      return acc
    },
    {} as Record<string, T[]>,
  )
}
