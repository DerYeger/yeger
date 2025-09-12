import { Stream } from '@yeger/streams'
import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'
import { useSearchParams } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type GraphParameter = 'tasks' | 'filter'

export function useGraphSettings() {
  const searchParams = useSearchParams()

  function setParameter(param: GraphParameter, newValue: string | null) {
    const newSearchParams = Stream.from(searchParams.entries())
      .filter(([key]) => key !== param)
      .concat(newValue ? [[param, newValue]] : [])
      .map(([key, value]) => `${key}=${value}`)
      .join('&')
    window.history.replaceState(null, '', `?${newSearchParams}`)
  }

  function getParameter(param: GraphParameter) {
    return searchParams.get(param)
  }

  return { setParameter, getParameter }
}
