'use client'

import { debounce } from '@yeger/debounce'
import { useEffect, useRef, useState } from 'react'
import type { ChangeEventHandler, ReactNode } from 'react'

import { Input } from './Input'
import { LogOutput } from './LogOutput'
import type { GraphParameter } from '../lib/utils'
import { useGraphSettings } from '../lib/utils'
import { Check, LoaderCircle, Info, Play, Ban } from 'lucide-react'
import { useRunTasks, useIsRunning, useAbortRun, useRunSummary } from '../lib/useRunQueries'

interface GraphInputProps {
  defaultValue?: string | undefined
}

interface GraphParameterInputProps extends GraphInputProps {
  param: GraphParameter
  placeholder: string
  disabled?: boolean
}

function GraphParameterInput({
  param,
  placeholder,
  defaultValue,
  disabled,
}: GraphParameterInputProps) {
  const { getParameter, setParameter } = useGraphSettings()
  const urlParameter = getParameter(param)
  const onChange: ChangeEventHandler<HTMLInputElement> = debounce(
    (event) => setParameter(param, event.target.value),
    0,
  )
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const newValue = urlParameter ?? defaultValue
    if (ref.current && newValue !== undefined) {
      ref.current.value = newValue
    }
  }, [ref, param, defaultValue, urlParameter])
  return (
    <Input
      ref={ref}
      type="text"
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="font-mono text-xs"
    />
  )
}

export interface TaskInputProps {
  tasks: string[]
}

export function TaskInput({ tasks }: TaskInputProps) {
  const { getParameter, setParameter } = useGraphSettings()
  const rawParameter = getParameter('tasks') ?? ''
  const [selection, setSelection] = useState(() => rawParameter.split(' ').filter((t) => tasks.includes(t)))
  const serializedSelection = selection.join(' ')
  const isRunning = useIsRunning()

  const isSelectAll = selection.length === tasks.length
  const onChangeIsSelectAll = () => {
    setSelection((selection) => selection.length === tasks.length ? [] : tasks)
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

  useEffect(() => {
    if (serializedSelection === rawParameter) {
      return
    }
    setParameter('tasks', serializedSelection)
  }, [setParameter, serializedSelection, rawParameter])

  const selectedSet = new Set(selection)

  const isLoading = serializedSelection !== rawParameter

  return (
    <Container>
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm">Tasks</div>
        <div className="flex items-center gap-2">{isLoading ? <LoaderCircle className="size-5 animate-spin" /> : null}</div>
      </div>
      <div className="flex flex-col gap-2 py-2 -my-2 overflow-y-auto font-mono [mask-image:linear-gradient(to_bottom,transparent,black_0.5rem,black_calc(100%-0.5rem),transparent)] [mask-repeat:no-repeat] [mask-size:100%_100%]">
        <Checkbox label="All" checked={isSelectAll} onChange={onChangeIsSelectAll} disabled={isRunning} />
        {tasks.map((task) => (
          <Checkbox
            key={task}
            label={task}
            checked={selectedSet.has(task)}
            onChange={() => onChange(task, selectedSet.has(task) ? 'remove' : 'add')}
            disabled={isRunning}
          />
        ))}
      </div>
    </Container>
  )
}

export function RunControls() {
  const { getParameter } = useGraphSettings()
  const isRunning = useIsRunning()
  const summary = useRunSummary()
  const run = useRunTasks()
  const abort = useAbortRun()

  // Read current selection and filter from URL params
  const tasksParam = (getParameter('tasks') ?? '').trim()
  const selectedTasks = tasksParam.length ? tasksParam.split(' ').filter(Boolean) : []
  const filterParam = getParameter('filter') ?? undefined

  // --force toggle is local state only
  const [forceChecked, setForceChecked] = useState(false)
  const onToggleForce = (checked: boolean) => setForceChecked(checked)

  const canRun = selectedTasks.length > 0 && !isRunning
  const onRun = () => run(selectedTasks, filterParam, { force: forceChecked })

  return (
    <Container>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 justify-between">
          <div className="text-sm">Run</div>
          <div className="flex gap-2">
            <button
              type="button"
              title="Abort run"
              onClick={abort}
              disabled={!isRunning}
              className="inline-flex items-center rounded-md border border-white/30 bg-red-600 p-1.5 text-white hover:enabled:bg-red-500  disabled:opacity-50 transition-all disabled:cursor-not-allowed"
            >
              <Ban className="size-4" />
            </button>
            <button
              type="button"
              title={canRun ? 'Run selected tasks' : 'Select tasks first'}
              onClick={onRun}
              disabled={!canRun}
              className="inline-flex items-center rounded-md border border-white/30 bg-green-600 p-1.5 text-white hover:enabled:bg-green-500 disabled:opacity-50 transition-all disabled:cursor-not-allowed"
            >
              {isRunning

                ? (
                  <LoaderCircle className="size-4 animate-spin" />
                )
                : (
                  <Play className="size-4" />
                )}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Checkbox label="force" checked={forceChecked} onChange={onToggleForce} disabled={isRunning} />
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

export function FilterInput({ defaultValue }: GraphInputProps) {
  const isRunning = useIsRunning()
  return (
    <Container>
      <div className="flex justify-between gap-2">
        <div className="text-sm">Filter</div>
        <abbr title="Enter any valid Turborepo filter, like @myorg/mypackage... or ...@myorg/mypackage or @myorg/mypackage.">
          <Info className="size-5" />
        </abbr>
      </div>
      <GraphParameterInput
        param="filter"
        placeholder="@myorg/mypackage..."
        defaultValue={defaultValue}
        disabled={isRunning}
      />
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

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  disabled?: boolean
}

function Checkbox({ checked, onChange, label, disabled }: CheckboxProps) {
  return (
    <label className={`group flex items-center gap-2 ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
      <div className="relative">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} disabled={disabled} className="sr-only" />
        <div
          className={`
          flex size-5 items-center justify-center rounded-md border
          border-white/30 backdrop-blur-sm transition-all duration-300 ease-out
          ${checked ? `bg-green-600 shadow-lg  ${disabled ? 'opacity-50' : 'hover:bg-green-500'}` : `bg-neutral-600 ${disabled ? 'opacity-50' : 'hover:bg-neutral-500'}`}
        `}
        >
          <Check
            className={`
            size-3 text-white transition-all duration-200
            ${checked ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}
          `}
          />
        </div>
      </div>
      <span className={`select-none text-white/90 transition-colors text-sm ${disabled ? '' : 'group-hover:text-white'}`}>{label}</span>
    </label>
  )
}
