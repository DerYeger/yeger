import { cn } from '../lib/utils'
import { Check } from 'lucide-react'

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
          className={cn(`
          flex size-5 items-center justify-center rounded-md border
          border-white/30 backdrop-blur-sm transition-all duration-300 ease-out
            group-focus-within:ring-2 ring-white
          ${checked ? `bg-green-600 shadow-lg  ${disabled ? 'opacity-50' : 'group-hover:bg-green-500 group-focus-within:bg-green-500'}` : `bg-neutral-600 ${disabled ? 'opacity-50' : 'group-hover:bg-neutral-500 group-focus-within:bg-neutral-500'}`}
        `)}
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
          'select-none text-white/90 transition-colors text-sm',
          !disabled && 'group-hover:text-white group-focus-within:text-white',
        )}
      >
        {label}
      </span>
    </label>
  )
}
