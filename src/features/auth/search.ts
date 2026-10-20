import { z } from 'zod'

// aceita só caminhos internos, para evitar open redirect (//evil.com, https://...)
export function safeRedirect(value: unknown, fallback = '/'): string {
  if (typeof value !== 'string') return fallback
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return fallback
  return value
}

// valores inválidos na url não quebram a página
export const AuthSearchSchema = z.object({
  redirect: z.string().optional().catch(undefined),
})
export type AuthSearch = z.infer<typeof AuthSearchSchema>