const devPresets = ['@vue/babel-preset-app']
const buildPresets = [
  [
    '@babel/preset-env',
    // Config for @babel/preset-env
    {
      include: [/(optional-chaining|nullish-coalescing)/],
    },
  ],
  '@babel/preset-typescript',
]
module.exports = {
  presets: process.env.NODE_ENV === 'development' ? devPresets : buildPresets,
}
