import { z } from 'zod'

// ?redirect= guarda para onde voltar depois do login
export const RedirectSearchSchema = z.object({
  redirect: z.string().optional().catch(undefined),
})

/** Só aceita caminhos internos (evita redirecionar para outro site). */
export function safeRedirect(value?: string): string {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : '/'
}