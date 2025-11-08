'use client'

import { useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'

export interface LogItem {
  id: string | number
  text: string
  kind?: 'log' | 'error'
}

export interface LogOutputProps {
  items: LogItem[]
  title?: string
  emptyText?: string
  containerClassName: string
  lineClassName?: string
  autoScroll?: boolean
  footer?: ReactNode
  style?: CSSProperties
}

export function LogOutput({
  items,
  title,
  emptyText = 'No output',
  containerClassName,
  lineClassName = 'text-[10px] leading-snug text-gray-300',
  autoScroll = true,
  footer,
  style,
}: LogOutputProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!autoScroll) {
      return
    }
    const el = ref.current
    if (!el) {
      return
    }
    el.scrollTop = el.scrollHeight
  }, [autoScroll, items.length])

  return (
    <div
      ref={ref}
      className={
        // isolate scroll from graph interactions by default
        `${containerClassName} nowheel nodrag`
      }
      style={{ overscrollBehavior: 'contain', touchAction: 'pan-y', ...style }}
      draggable={false}
    >
      {title ? (
        <div className="mb-1 text-[10px] uppercase tracking-wide text-neutral-400">{title}</div>
      ) : null}
      {items.length === 0 ? (
        <span className="text-neutral-600 text-sm">{emptyText}</span>
      ) : (
        <div className="font-mono text-sm pr-2">
          {items.map((l) => (
            <div
              key={l.id}
              className={`${lineClassName} break-words ${l.kind === 'error' ? 'text-red-400' : ''}`}
            >
              {l.text}
            </div>
          ))}
        </div>
      )}
      {footer}
    </div>
  )
}

export default LogOutput
