import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  clean: true,
  declaration: true,
  externals: ['*'],
})
