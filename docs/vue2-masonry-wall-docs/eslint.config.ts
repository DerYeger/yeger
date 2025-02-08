import yeger from '@yeger/eslint-config'

export default yeger({
  rules: {
    'vue/custom-event-name-casing': 'off',
    'vue/no-deprecated-v-bind-sync': 'off',
    'vue/require-explicit-emits': 'off',
  },
})
