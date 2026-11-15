'use client'

import { parseAsString, useQueryState } from 'nuqs'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
  UNAUTHORIZED_EVENT,
  clearStoredAuthCode,
  getAuthHeaders,
  getStoredAuthCode,
  setStoredAuthCode,
} from '../lib/authClient'
import { AUTH_QUERY_PARAM } from '../lib/authConstants'
import { AuthCodeEntry } from './AuthCodeEntry'
import { Graph } from './Graph'
import { TaskInput, FilterInput, RunControls } from './ParameterInputs'

type AuthState =
  | { status: 'checking' }
  | { status: 'unauthenticated'; invalid: boolean }
  | { status: 'authenticated'; tasks: string[] }

/** Loads the task list, which doubles as the check whether a code is valid. */
async function fetchTasks(code: string): Promise<string[] | 'unauthorized'> {
  const res = await fetch('/api/tasks', { headers: getAuthHeaders(code), cache: 'no-store' })
  if (res.status === 401) {
    return 'unauthorized'
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}) as { error?: string })
    throw new Error(body?.error || `Tasks fetch failed (${res.status})`)
  }
  return res.json()
}

export function App() {
  const [urlCode, setUrlCode] = useQueryState(AUTH_QUERY_PARAM, parseAsString)
  const [state, setState] = useState<AuthState>({ status: 'checking' })
  const [error, setError] = useState<string | null>(null)
  const initialized = useRef(false)

  const authenticate = useCallback(async (code: string, isUserInput: boolean) => {
    try {
      const result = await fetchTasks(code)
      setError(null)
      if (result === 'unauthorized') {
        clearStoredAuthCode()
        setState({ status: 'unauthenticated', invalid: isUserInput })
        return
      }
      setStoredAuthCode(code)
      setState({ status: 'authenticated', tasks: result })
    } catch (err) {
      setError((err as Error).message)
      setState({ status: 'unauthenticated', invalid: false })
    }
  }, [])

  useEffect(() => {
    if (initialized.current) {
      return
    }
    initialized.current = true
    // The URL and localStorage are only available after hydration, so the initial state cannot be derived during render.
    // A code from the URL (e.g., via `--open`) takes precedence and is removed from the address bar right away.
    if (urlCode) {
      void setUrlCode(null, { history: 'replace' })
      // oxlint-disable-next-line react/set-state-in-effect
      void authenticate(urlCode, true)
      return
    }
    const stored = getStoredAuthCode()
    if (stored) {
      void authenticate(stored, false)
    } else {
      // oxlint-disable-next-line react/set-state-in-effect
      setState({ status: 'unauthenticated', invalid: false })
    }
  }, [urlCode, setUrlCode, authenticate])

  useEffect(() => {
    const onUnauthorized = () => setState({ status: 'unauthenticated', invalid: false })
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
  }, [])

  if (state.status === 'checking') {
    return <div className="size-full" />
  }

  if (state.status === 'unauthenticated') {
    return (
      <AuthCodeEntry
        invalid={state.invalid}
        error={error}
        onSubmit={(code) => authenticate(code, true)}
      />
    )
  }

  return (
    <>
      <div
        id="sidebar"
        className="absolute inset-y-0 left-0 z-10 flex max-h-screen w-(--sidebar-width) flex-col gap-4 overflow-hidden p-4"
      >
        <RunControls />
        <FilterInput />
        <div className="grow overflow-hidden">
          <TaskInput tasks={state.tasks} />
        </div>
      </div>
      <Graph tasks={state.tasks} />
    </>
  )
}
