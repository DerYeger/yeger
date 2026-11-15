'use client'

import { KeyRound } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'

import { Input } from './Input'

export function AuthCodeEntry({
  invalid,
  error,
  onSubmit,
}: {
  invalid: boolean
  error: string | null
  onSubmit: (code: string) => Promise<void>
}) {
  const [value, setValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const code = value.trim()
    if (!code || isSubmitting) {
      return
    }
    // The code is sent in a header, never in the URL, so it does not end up in the address bar or history
    setIsSubmitting(true)
    try {
      await onSubmit(code)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex size-full items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-md border border-neutral-400/20 bg-neutral-400/20 p-4 text-neutral-300"
      >
        <div className="flex items-center gap-2">
          <KeyRound className="size-5" />
          <h1 className="text-lg font-medium">Turbo Graph</h1>
        </div>
        <p className="text-sm text-neutral-400">
          Enter the auth code printed by the <code>turbo-graph</code> CLI.
        </p>
        <Input
          name="code"
          type="password"
          autoComplete="off"
          spellCheck={false}
          placeholder="Auth code"
          aria-label="Auth code"
          aria-invalid={invalid}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        {invalid && <p className="text-sm text-red-400">Invalid auth code.</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={!value.trim() || isSubmitting}
          className="inline-flex items-center justify-center rounded-md border border-white/30 bg-green-600 px-3 py-2 text-sm text-white transition-all disabled:opacity-50 hocus:enabled:bg-green-500"
        >
          Continue
        </button>
      </form>
    </div>
  )
}
