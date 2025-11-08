import { useCallback, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface TaskLogLine {
  id: number
  raw: string
  kind: 'log' | 'error'
}

export interface TaskRunState {
  lines: TaskLogLine[]
  running: boolean
}

interface RunState {
  isRunning: boolean
  summary: string[]
  tasks: Record<string, TaskRunState>
  counter: number
}

const DEFAULT_STATE: RunState = {
  isRunning: false,
  summary: [],
  tasks: {},
  counter: 0,
}

function ensureTask(state: RunState, id: string): TaskRunState {
  if (!state.tasks[id]) {
    state.tasks[id] = { lines: [], running: false }
  }
  return state.tasks[id]
}

let currentAbort: (() => void) | null = null

function useRunState() {
  return useQuery<RunState>({
    queryKey: ['runStream'],
    queryFn: async () => DEFAULT_STATE,
    initialData: DEFAULT_STATE,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    gcTime: Infinity,
  })
}

export function useTaskRun(taskId: string) {
  const { data } = useRunState()
  const task = data!.tasks[taskId]
  return task ?? { lines: [], running: false }
}

export function useIsRunning() {
  const { data } = useRunState()
  return data!.isRunning
}

export function useRunSummary() {
  const { data } = useRunState()
  return data!.summary
}

export function useRunTasks() {
  const esRef = useRef<EventSource | null>(null)
  const client = useQueryClient()
  const mutation = useMutation({
    mutationKey: ['runStream', 'start'],
    mutationFn: async (vars: { tasks: string[]; filter?: string; force?: boolean }) => {
      const { tasks, filter, force } = vars
      if (!tasks.length) {
        return
      }
      // Reset state
      client.setQueryData<RunState>(['runStream'], () => ({ ...DEFAULT_STATE, isRunning: true }))

      // Build SSE URL with query params
      const url = new URL('/api/run', window.location.origin)
      for (const t of tasks) {
        url.searchParams.append('tasks', t)
      }
      if (filter) {
        url.searchParams.set('filter', filter)
      }
      if (force) {
        url.searchParams.set('force', '1')
      }

      const es = new EventSource(url.toString())
      esRef.current = es
      let ended = false

      let lastActivity = Date.now()
      const ACTIVITY_TIMEOUT = 60000
      const activityInterval = setInterval(() => {
        if (Date.now() - lastActivity > ACTIVITY_TIMEOUT) {
          es.onerror = null
          esRef.current?.close()
          clearInterval(activityInterval)
          client.setQueryData<RunState>(['runStream'], (prev) => {
            const base = prev ?? DEFAULT_STATE
            const state: RunState = { ...base, isRunning: false, tasks: { ...base.tasks } }
            for (const key of Object.keys(state.tasks)) {
              const t = state.tasks[key]
              state.tasks[key] = { lines: t?.lines ?? [], running: false }
            }
            return state
          })
          currentAbort = null
        }
      }, 10000)

      currentAbort = () => {
        es.onerror = null
        esRef.current?.close()
        clearInterval(activityInterval)
        client.setQueryData<RunState>(['runStream'], (prev) => {
          const base = prev ?? DEFAULT_STATE
          const state: RunState = { ...base, isRunning: false, tasks: { ...base.tasks } }
          for (const key of Object.keys(state.tasks)) {
            const t = state.tasks[key]
            state.tasks[key] = { lines: t?.lines ?? [], running: false }
          }
          return state
        })
      }

      const seenKeys = new Set<string>()
      function stripAnsi(input: string) {
        let out = ''
        let i = 0
        while (i < input.length) {
          const ch = input.charCodeAt(i)
          if (ch === 0x1b /* ESC */ && input[i + 1] === '[') {
            i += 2
            while (i < input.length) {
              const code = input.charCodeAt(i)
              if (code >= 0x40 && code <= 0x7e) {
                i += 1
                break
              }
              i += 1
            }
            continue
          }
          out += input[i]
          i += 1
        }
        return out
      }

      const GLOBAL_LIMIT = 500
      function handleDataEvent(event: 'log' | 'error', data: string) {
        lastActivity = Date.now()
        const lines = data.split(/\n/).filter(Boolean)
        client.setQueryData<RunState>(['runStream'], (prev) => {
          const state = { ...(prev ?? DEFAULT_STATE), tasks: { ...(prev ?? DEFAULT_STATE).tasks } }
          for (const rawLine of lines) {
            const clean = stripAnsi(rawLine).trimStart()
            let id: string | undefined
            let content: string | undefined
            const firstSpaceIndex = clean.indexOf(' ')
            if (firstSpaceIndex > 1 && clean[firstSpaceIndex - 1] === ':') {
              // we have a package prefix like "pkg:task: " or "task: "
              id = clean.slice(0, firstSpaceIndex - 1)
              content = clean.slice(firstSpaceIndex + 1).trim()
            }
            if (!id) {
              const trimmed = clean.trimEnd()
              if (trimmed) {
                const next = [...state.summary, trimmed].slice(-GLOBAL_LIMIT)
                state.summary = next
              }
              continue
            }
            seenKeys.add(id)
            const t = ensureTask(state, id)
            t.running = true
            if (!content) {
              continue
            }
            state.counter += 1
            t.lines = [...t.lines, { id: state.counter, raw: content, kind: event }]
          }
          return state
        })
      }

      es.addEventListener('log', (e: MessageEvent) => handleDataEvent('log', String(e.data)))
      es.addEventListener('stderr', (e: MessageEvent) => handleDataEvent('error', String(e.data)))
      es.onerror = () => {
        if (ended) {
          return
        }
        es.close()
        clearInterval(activityInterval)
        client.setQueryData<RunState>(['runStream'], (prev) => {
          const base = prev ?? DEFAULT_STATE
          const state: RunState = { ...base, isRunning: false, tasks: { ...base.tasks } }
          for (const key of Object.keys(state.tasks)) {
            const t = state.tasks[key]
            state.tasks[key] = { lines: t?.lines ?? [], running: false }
          }
          return state
        })
        currentAbort = null
      }
      es.addEventListener('heartbeat', () => {
        lastActivity = Date.now()
      })
      es.addEventListener('start', () => {
        lastActivity = Date.now()
      })
      es.addEventListener('end', () => {
        ended = true
        client.setQueryData<RunState>(['runStream'], (prev) => {
          const state = {
            ...(prev ?? DEFAULT_STATE),
            isRunning: false,
            tasks: { ...(prev ?? DEFAULT_STATE).tasks },
          }
          for (const id of seenKeys) {
            const t = ensureTask(state, id)
            t.running = false
          }
          return state
        })
        clearInterval(activityInterval)
        es.close()
        es.onerror = null
        currentAbort = null
      })

      // Return a promise that resolves when stream ends
      await new Promise<void>((resolve) => {
        es.addEventListener('end', () => resolve(), { once: true })
        es.addEventListener('error', () => resolve(), { once: true })
      })
    },
  })

  return useCallback(
    (tasks: string[], filter?: string, opts?: { force?: boolean }) => {
      const vars: { tasks: string[]; filter?: string; force?: boolean } = { tasks }
      if (filter !== undefined) {
        vars.filter = filter
      }
      if (opts?.force !== undefined) {
        vars.force = opts.force
      }
      return mutation.mutate(vars)
    },
    [mutation],
  )
}

export function useAbortRun() {
  return useCallback(() => {
    if (currentAbort) {
      currentAbort()
    }
  }, [])
}
