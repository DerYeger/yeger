'use client'

import { debounce } from '@yeger/debounce'
import { type ChangeEventHandler, useEffect, useRef } from 'react'

import { Input } from '../components/Input'
import type { GraphParameter } from '../lib/utils'
import { useGraphSettings } from '../lib/utils'

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
    500,
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
    />
  )
}

export function TaskInput({ defaultValue }: GraphInputProps) {
  return (
    <GraphParameterInput
      param="tasks"
      placeholder="Tasks"
      defaultValue={defaultValue}
    />
  )
}

export function FilterInput({ defaultValue }: GraphInputProps) {
  return (
    <GraphParameterInput
      param="filter"
      placeholder="Filter"
      defaultValue={defaultValue}
    />
  )
}
