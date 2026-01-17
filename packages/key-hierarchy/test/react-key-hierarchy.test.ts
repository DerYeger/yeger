import { describe, expect, it, vi } from 'vitest'
import { useQuery } from '@tanstack/react-query'
import { waitFor } from '@testing-library/react'
import { defineKeyHierarchy, defineKeyHierarchyModule } from '../src/index'
import * as React from 'react'
import { useMemo } from 'react'
import { withReactComponentLifecycle } from './react-test-utils'

const module = defineKeyHierarchyModule((dynamic) => ({
  test: {
    identity: dynamic<string>(),
  },
}))

describe('defineKeyHierarchy for @tanstack/react-query', () => {
  it('works with default options', async () => {
    const keys = defineKeyHierarchy(module)
    const queryFn = vi.fn((input) => Promise.resolve(input))

    const result = withReactComponentLifecycle(() => {
      const [input, setInput] = React.useState('1')
      const queryKey = useMemo(() => keys.test.identity(input), [input])
      const query = useQuery({
        queryKey,
        queryFn: () => queryFn(input),
      })
      return {
        input,
        setInput,
        query,
        queryKey,
      }
    })

    await waitFor(() => {
      expect(queryFn).toHaveBeenCalledTimes(1)
      expect(result.current.query.data).toBe('1')
      expect(result.current.queryKey).toStrictEqual(['test', ['identity', '1']])
    })

    result.current.setInput('2')
    await waitFor(() => {
      expect(queryFn).toHaveBeenCalledTimes(2)
      expect(result.current.query.data).toBe('2')
      expect(result.current.queryKey).toStrictEqual(['test', ['identity', '2']])
    })
  })

  it('works with precomputation', async () => {
    const keys = defineKeyHierarchy(module, { method: 'precompute' })
    const queryFn = vi.fn((input) => Promise.resolve(input))

    const result = withReactComponentLifecycle(() => {
      const [input, setInput] = React.useState('1')
      const queryKey = useMemo(() => keys.test.identity(input), [input])
      const query = useQuery({
        queryKey,
        queryFn: () => queryFn(input),
      })
      return {
        input,
        setInput,
        query,
        queryKey,
      }
    })

    await waitFor(() => {
      expect(queryFn).toHaveBeenCalledTimes(1)
      expect(result.current.query.data).toBe('1')
      expect(result.current.queryKey).toStrictEqual(['test', ['identity', '1']])
    })

    result.current.setInput('2')
    await waitFor(() => {
      expect(queryFn).toHaveBeenCalledTimes(2)
      expect(result.current.query.data).toBe('2')
      expect(result.current.queryKey).toStrictEqual(['test', ['identity', '2']])
    })
  })

  it('works with freeze enabled', async () => {
    const keys = defineKeyHierarchy(module, { freeze: true })
    const queryFn = vi.fn((input) => Promise.resolve(input))

    const result = withReactComponentLifecycle(() => {
      const [input, setInput] = React.useState('1')
      const queryKey = useMemo(() => keys.test.identity(input), [input])
      const query = useQuery({
        queryKey,
        queryFn: () => queryFn(input),
      })
      return {
        input,
        setInput,
        query,
        queryKey,
      }
    })

    await waitFor(() => {
      expect(queryFn).toHaveBeenCalledTimes(1)
      expect(result.current.query.data).toBe('1')
      expect(result.current.queryKey).toStrictEqual(['test', ['identity', '1']])
    })

    result.current.setInput('2')
    await waitFor(() => {
      expect(queryFn).toHaveBeenCalledTimes(2)
      expect(result.current.query.data).toBe('2')
      expect(result.current.queryKey).toStrictEqual(['test', ['identity', '2']])
    })
  })
})
