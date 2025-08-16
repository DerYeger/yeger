// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { useQuery } from '@tanstack/react-query'
import { waitFor } from '@testing-library/react'
import { defineKeyHierarchy } from '~/index'
import React, { useMemo } from 'react'
import { withReactComponentLifecycle } from '~test/react-test-utils'

describe('defineKeyHierarchy for @tanstack/react-query', () => {
  it('works with default options', async () => {
    const identitySpy = vi.fn((_input: string) => true)
    const keys = defineKeyHierarchy({
      test: {
        identity: identitySpy,
      },
    })
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
      expect(identitySpy).toHaveBeenCalledTimes(1)
      expect(queryFn).toHaveBeenCalledTimes(1)
      expect(result.current.query.data).toBe('1')
      expect(result.current.queryKey).toStrictEqual(['test', ['identity', '1']])
    })

    result.current.setInput('2')
    await waitFor(() => {
      expect(identitySpy).toHaveBeenCalledTimes(2)
      expect(queryFn).toHaveBeenCalledTimes(2)
      expect(result.current.query.data).toBe('2')
      expect(result.current.queryKey).toStrictEqual(['test', ['identity', '2']])
    })
  })

  it('works with precomputation', async () => {
    const identitySpy = vi.fn((_input: string) => true)
    const keys = defineKeyHierarchy({
      test: {
        identity: identitySpy,
      },
    }, { method: 'precompute' })
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
      expect(identitySpy).toHaveBeenCalledTimes(1)
      expect(queryFn).toHaveBeenCalledTimes(1)
      expect(result.current.query.data).toBe('1')
      expect(result.current.queryKey).toStrictEqual(['test', ['identity', '1']])
    })

    result.current.setInput('2')
    await waitFor(() => {
      expect(identitySpy).toHaveBeenCalledTimes(1)
      expect(queryFn).toHaveBeenCalledTimes(2)
      expect(result.current.query.data).toBe('2')
      expect(result.current.queryKey).toStrictEqual(['test', ['identity', '2']])
    })
  })

  it('works with freeze enabled', async () => {
    const identitySpy = vi.fn((_input: string) => true)
    const keys = defineKeyHierarchy({
      test: {
        identity: identitySpy,
      },
    }, { freeze: true })
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
      expect(identitySpy).toHaveBeenCalledTimes(1)
      expect(queryFn).toHaveBeenCalledTimes(1)
      expect(result.current.query.data).toBe('1')
      expect(result.current.queryKey).toStrictEqual(['test', ['identity', '1']])
    })

    result.current.setInput('2')
    await waitFor(() => {
      expect(identitySpy).toHaveBeenCalledTimes(2)
      expect(queryFn).toHaveBeenCalledTimes(2)
      expect(result.current.query.data).toBe('2')
      expect(result.current.queryKey).toStrictEqual(['test', ['identity', '2']])
    })
  })
})
