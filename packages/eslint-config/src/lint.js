const { ESLint } = require('eslint')

;(async function main() {
  // 1. Create an instance.
  const fix = process.argv.includes('--fix')
  const eslint = new ESLint({ fix })

  // 2. Lint files.
  const results = await eslint.lintFiles([
    './**/*.{js,json,md,ts,vue,yaml,yml}',
  ])
  const errors = results.filter(
    ({ errorCount, fatalErrorCount }) => errorCount || fatalErrorCount
  )

  if (fix) {
    await ESLint.outputFixes(results)
  }

  // 3. Format the results.
  const formatter = await eslint.loadFormatter('stylish')
  const resultText = formatter.format(results)

  // 4. Output it.
  console.log(resultText)
  process.exitCode = errors.length > 0 ? 1 : 0
})().catch((error) => {
  process.exitCode = 1
  console.error(error)
})
