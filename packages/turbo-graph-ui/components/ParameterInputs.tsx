'use client'

import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { debounce } from '@yeger/debounce'

import { Input } from './Input'
import { LogOutput } from './LogOutput'
import { LoaderCircle, Info, Play, Ban } from 'lucide-react'
import { useRunTasks, useIsRunning, useAbortRun, useRunSummary } from '../lib/useRunQueries'
import { useFilterInput, useForceFlag, useTaskSelection } from '../lib/parameters'
import { parseAsString, useQueryState } from 'nuqs'
import { Checkbox } from './Checkbox'

export function RunControls() {
  const [selectedTasks] = useTaskSelection()
  const [filter] = useFilterInput()
  const isRunning = useIsRunning()
  const summary = useRunSummary()
  const run = useRunTasks()
  const abort = useAbortRun()

  const [forceFlag, setForceFlag] = useForceFlag()
  const onToggleForce = (checked: boolean) => setForceFlag(checked)

  const canRun = selectedTasks.length > 0 && !isRunning
  const onRun = () => {
    run(selectedTasks, filter ?? undefined, { force: forceFlag })
    setTimeout(() => document.getElementById('abort-button')?.focus(), 0)
  }

  const onAbort = () => {
    abort()
    setTimeout(() => document.getElementById('run-button')?.focus(), 0)
  }

  return (
    <Container>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 justify-between">
          <div className="text-sm">Run</div>
          <div className="flex gap-2">
            <button
              id="abort-button"
              type="button"
              title="Abort run"
              onClick={onAbort}
              disabled={!isRunning}
              className="inline-flex items-center rounded-md border border-white/30 bg-red-600 p-1.5 text-white hocus:enabled:bg-red-500 disabled:opacity-50 transition-all"
            >
              <Ban className="size-4" />
            </button>
            <button
              id="run-button"
              type="button"
              title={canRun ? 'Run selected tasks' : 'Select tasks first'}
              onClick={onRun}
              disabled={!canRun}
              className="inline-flex items-center rounded-md border border-white/30 bg-green-600 p-1.5 text-white hocus:enabled:bg-green-500 disabled:opacity-50 transition-all"
            >
              {isRunning ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Play className="size-4" />
              )}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Checkbox
            label="force"
            checked={forceFlag}
            onChange={onToggleForce}
            disabled={isRunning}
          />
        </div>
      </div>
      <div className="rounded-md border border-white/10 bg-black/20">
        <LogOutput
          title="Output"
          items={summary.map((text, idx) => ({ id: idx, text }))}
          containerClassName="max-h-48 overflow-y-auto p-2 [mask-image:linear-gradient(to_bottom,transparent,black_0.5rem,black_calc(100%-0.5rem),transparent)] [mask-repeat:no-repeat] [mask-size:100%_100%]"
          lineClassName="text-xs leading-tight text-neutral-200"
        />
      </div>
    </Container>
  )
}

export function FilterInput() {
  const isRunning = useIsRunning()
  const [filter, setFilter] = useFilterInput()

  const debouncedSetFilter = useMemo(
    () => debounce((value: string) => setFilter(value.trim() || null), 500),
    [setFilter],
  )
  return (
    <Container>
      <div className="flex justify-between gap-2">
        <div className="text-sm">Filter</div>
        <abbr title="Enter any valid Turborepo filter, like @myorg/mypackage... or ...@myorg/mypackage or @myorg/mypackage.">
          <Info className="size-5" />
        </abbr>
      </div>
      <Input
        defaultValue={filter ?? ''}
        onChange={(e) => debouncedSetFilter(e.target.value)}
        placeholder="@myorg/mypackage..."
        disabled={isRunning}
        className="font-mono text-xs"
      />
    </Container>
  )
}

export interface TaskInputProps {
  tasks: string[]
}

export function TaskInput({ tasks }: TaskInputProps) {
  const [selection, setSelection] = useTaskSelection()

  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''))

  const filteredTasks = useMemo(() => {
    if (!search) {
      return tasks
    }
    return tasks.filter((task) => task.toLowerCase().includes(search))
  }, [tasks, search])

  const isRunning = useIsRunning()

  const isSelectAll = selection.length === tasks.length
  const onChangeIsSelectAll = (newSelectAll: boolean) => {
    setSelection(() => (newSelectAll ? tasks : []))
  }

  function onChange(task: string, action: 'add' | 'remove') {
    setSelection((selection) => {
      if (action === 'remove') {
        return selection.filter((t) => t !== task)
      } else {
        return [...selection, task].toSorted()
      }
    })
  }

  const selectedSet = useMemo(() => new Set(selection), [selection])

  return (
    <Container>
      <div className="text-sm">Tasks</div>
      <Input
        type="search"
        placeholder="Search tasks..."
        defaultValue={search}
        onChange={(e) => setSearch(e.target.value.trim().toLowerCase())}
        disabled={isRunning}
        className="font-mono text-xs"
      />
      <div className="flex flex-col gap-2 p-2 -m-2 overflow-y-auto font-mono [mask-image:linear-gradient(to_bottom,transparent,black_0.5rem,black_calc(100%-0.5rem),transparent)] [mask-repeat:no-repeat] [mask-size:100%_100%]">
        {!search ? (
          <Checkbox
            label="All"
            checked={isSelectAll}
            onChange={onChangeIsSelectAll}
            disabled={isRunning}
          />
        ) : null}
        {filteredTasks.map((task) => (
          <Checkbox
            key={task}
            label={task}
            checked={selectedSet.has(task)}
            onChange={() => onChange(task, selectedSet.has(task) ? 'remove' : 'add')}
            disabled={isRunning}
          />
        ))}
        {filteredTasks.length === 0 ? (
          <div className="text-sm text-neutral-500">No matching tasks</div>
        ) : null}
      </div>
    </Container>
  )
}

function Container({ children }: { children: ReactNode }) {
  return (
    <div className="flex max-h-full flex-col gap-2 rounded-md border border-neutral-400/20 bg-neutral-400/20 p-2 text-neutral-300 backdrop-blur-[3px]">
      {children}
    </div>
  )
}
