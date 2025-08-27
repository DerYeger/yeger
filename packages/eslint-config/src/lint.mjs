#!/usr/bin/env node
import { argv, exit } from 'node:process'

import { ESLint } from 'eslint'
import colors from 'picocolors'

const { green } = colors

async function main() {
  // 1. Create an instance.
  const fix = argv.includes('--fix')

  const eslint = new ESLint({ fix })

  // 2. Lint files.
  const results = await eslint.lintFiles([
    './**/*.{astro,cjs,html,js,jsx,json,md,mjs,mts,svelte,ts,tsx,vue,yaml,yml}',
  ])
  const hasErrors = results.some(
    ({ errorCount, fatalErrorCount }) => errorCount > 0 || fatalErrorCount > 0,
  )

  if (fix) {
    await ESLint.outputFixes(results)
  }

  // 3. Format the results.
  const formatter = await eslint.loadFormatter('stylish')
  const resultText = formatter.format(results)

  // 4. Output it.
  if (resultText.length > 0) {
    // eslint-disable-next-line no-console
    console.log(resultText)
  } else {
    // eslint-disable-next-line no-console
    console.log(green('✔ No ESLint warnings or errors'))
  }
  exit(hasErrors > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error(error)
  exit(1)
})
