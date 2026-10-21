import { useState, type ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export const inputClass =
  'mt-1 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring'

export function Field({
  id,
  label,
  required = false,
  type = 'text',
  placeholder,
  children,
}: {
  id: string
  label: string
  required?: boolean
  type?: string
  placeholder?: string
  children?: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm">
        {label}
        {required && <span className="ml-0.5 text-destructive" aria-hidden="true">*</span>}
      </label>
      {children ?? (
        <input id={id} name={id} type={type} required={required} placeholder={placeholder} className={inputClass} />
      )}
    </div>
  )
}

export function SelectField({
  id,
  label,
  placeholder,
  options,
  required = false,
}: {
  id: string
  label: string
  placeholder: string
  options: string[]
  required?: boolean
}) {
  return (
    <Field id={id} label={label} required={required}>
      <select id={id} name={id} required={required} defaultValue="" className={inputClass}>
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </Field>
  )
}

export function PasswordField({ id, label }: { id: string; label: string }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label htmlFor={id} className="text-sm">{label}</label>
      <div className="relative">
        <input id={id} name={id} type={show ? 'text' : 'password'} className={`${inputClass} pr-10`} />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground outline-none hover:text-brand focus-visible:ring-2 focus-visible:ring-ring"
        >
          {show ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
        </button>
      </div>
    </div>
  )
}

export function EnsField({ id }: { id: string }) {
  return (
    <Field id={id} label="Nome ENS" required>
      <div className="flex gap-2">
        <select aria-label="Domínio" className={`${inputClass} w-24`}><option>.eth</option></select>
        <input id={id} name={id} required className={inputClass} />
      </div>
    </Field>
  )
}

export const primaryButton =
  'bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring'
