import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { ApiError } from '@/contracts'

/**
 * Leva os erros por campo vindos da API para o formulário.
 * Devolve uma mensagem geral quando o erro não pertence a nenhum campo.
 */
export function applyApiError<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly Path<T>[],
): string | null {
  if (error instanceof ApiError && error.fieldErrors) {
    let applied = false
    for (const field of fields) {
      const message = error.fieldErrors[field as string]
      if (message) {
        setError(field, { type: 'server', message })
        applied = true
      }
    }
    if (applied) return null
  }
  if (error instanceof ApiError && error.code === 'NETWORK') {
    return 'Sem conexão. Verifique sua internet e tente de novo.'
  }
  return 'Não foi possível concluir. Tente novamente em instantes.'
}