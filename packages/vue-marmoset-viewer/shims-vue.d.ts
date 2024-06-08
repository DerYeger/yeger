declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const Component: DefineComponent<object, object, any>
  export default Component
}
