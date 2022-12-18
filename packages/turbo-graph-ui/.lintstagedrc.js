const path = require('path')

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`

module.exports = {
  '*.{astro,html,js,jsx,json,md,ts,tsx,vue,yaml,yml}': [buildEslintCommand],
}
