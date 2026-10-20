import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { ApiError } from '@/contracts'

// aplica fieldErrors do servidor nos campos e devolve a mensagem geral do formulário
// (string vazia quando o erro já foi mostrado nos campos)
export function applyApiError<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly Path<T>[],
): string {
  if (!(error instanceof ApiError)) return 'Erro inesperado'

  let applied = false
  for (const field of fields) {
    const message = error.fieldErrors?.[field]
    if (message) {
      setError(field, { type: 'server', message })
      applied = true
    }
  }
  return applied ? '' : error.message
}