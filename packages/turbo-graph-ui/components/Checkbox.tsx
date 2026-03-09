import { Check } from 'lucide-react'

import { cn } from '../lib/utils'

export interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  disabled?: boolean
}

export function Checkbox({ checked, onChange, label, disabled }: CheckboxProps) {
  return (
    <label
      htmlFor={`checkbox-${label}`}
      className={cn('group flex items-center gap-2', disabled ? 'opacity-60' : 'cursor-pointer')}
    >
      <div className="relative">
        <input
          type="checkbox"
          id={`checkbox-${label}`}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={cn(
            `flex size-5 items-center justify-center rounded-md border border-white/30 ring-white backdrop-blur-sm transition-all duration-300 ease-out group-focus-within:ring-2 ${checked ? `bg-green-600 shadow-lg ${disabled ? 'opacity-50' : 'group-focus-within:bg-green-500 group-hover:bg-green-500'}` : `bg-neutral-600 ${disabled ? 'opacity-50' : 'group-focus-within:bg-neutral-500 group-hover:bg-neutral-500'}`} `,
          )}
        >
          <Check
            className={cn(
              'size-3 text-white transition-all duration-200',
              checked ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
            )}
          />
        </div>
      </div>
      <span
        className={cn(
          'text-sm text-white/90 transition-colors select-none',
          !disabled && 'group-focus-within:text-white group-hover:text-white',
        )}
      >
        {label}
      </span>
    </label>
  )
}
