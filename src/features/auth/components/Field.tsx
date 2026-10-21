import type { ReactNode } from 'react'

export const inputClass =
  'h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-destructive'

type Props = { id: string; label: string; error?: string; hint?: string; children: ReactNode }

/** Rótulo + campo + dica/erro. O input vem como children e referencia `${id}-error` / `${id}-hint`. */
export function Field({ id, label, error, hint, children }: Props) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}