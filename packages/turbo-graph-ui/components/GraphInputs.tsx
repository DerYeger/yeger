'use client'

import { debounce } from '@yeger/debounce'
import { useEffect, useRef, useState } from 'react'
import type { ChangeEventHandler, ReactNode } from 'react'

import { Input } from '../components/Input'
import type { GraphParameter } from '../lib/utils'
import { useGraphSettings } from '../lib/utils'
import { Check, LoaderCircle, Info } from 'lucide-react'

interface GraphInputProps {
  defaultValue?: string | undefined
}

interface GraphParameterInputProps extends GraphInputProps {
  param: GraphParameter
  placeholder: string
}

function GraphParameterInput({
  param,
  placeholder,
  defaultValue,
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
      className="font-mono"
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
      <div className="flex justify-between gap-2">
        <div className="text-sm">Tasks</div>
        {isLoading ? <LoaderCircle className="size-5 animate-spin" /> : null}
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto font-mono">
        <Checkbox label="All" checked={isSelectAll} onChange={onChangeIsSelectAll} />
        {tasks.map((task) => (
          <Checkbox key={task} label={task} checked={selectedSet.has(task)} onChange={() => onChange(task, selectedSet.has(task) ? 'remove' : 'add')} />
        ))}
      </div>
    </Container>
  )
}

export function FilterInput({ defaultValue }: GraphInputProps) {
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
      />
    </Container>
  )
}

function Container({ children }: { children: ReactNode }) {
  return (
    <div className="flex max-h-full flex-col gap-2 rounded-md border border-neutral-400/20 bg-neutral-400/20 p-2 text-neutral-300 backdrop-blur-[1px]">
      {children}
    </div>
  )
}

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="group flex cursor-pointer items-center gap-3">
      <div className="relative">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
        <div
          className={`
          flex size-5 items-center justify-center rounded-md border
          border-white/30 backdrop-blur-sm transition-all duration-300 ease-out
          ${checked ? 'bg-green-500/20 shadow-lg' : 'bg-red-500/10 hover:bg-white/15'}
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
      <span className="select-none text-white/90 transition-colors group-hover:text-white">{label}</span>
    </label>
  )
}
