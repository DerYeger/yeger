import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import * as React from 'react'

export function withReactComponentLifecycle<T>(render: () => T) {
  const { result } = renderHook(() => render(), {
    wrapper: createWrapper(),
  })
  return result
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}
