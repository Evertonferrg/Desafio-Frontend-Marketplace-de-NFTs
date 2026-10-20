import axios, { AxiosError } from 'axios'
import { ApiError, ApiErrorBodySchema, type ApiErrorCode } from '@/contracts'

export const http = axios.create({ baseURL: '/api', timeout: 8000 })

let getToken: () => string | null = () => null
let onUnauthenticated: () => void = () => {}

export function configureHttp(opts: {
  getToken: () => string | null
  onUnauthenticated: () => void
}) {
  getToken = opts.getToken
  onUnauthenticated = opts.onUnauthenticated
}

http.interceptors.request.use((cfg) => {
  const token = getToken()
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

const byStatus = (s: number): ApiErrorCode =>
  s === 401
    ? 'UNAUTHENTICATED'
    : s === 403
      ? 'FORBIDDEN'
      : s === 404
        ? 'NOT_FOUND'
        : s === 409
          ? 'CONFLICT'
          : s === 400 || s === 422
            ? 'VALIDATION'
            : 'TRANSIENT'

http.interceptors.response.use(
  (r) => r,
  (err: AxiosError) => {
    // requisição cancelada (resposta obsoleta): não é erro de negócio
    if (axios.isCancel(err)) return Promise.reject(err)

    if (!err.response) {
      const timeout = err.code === 'ECONNABORTED'
      return Promise.reject(
        new ApiError(timeout ? 'TRANSIENT' : 'NETWORK', timeout ? 'Tempo esgotado' : 'Sem conexão'),
      )
    }

    const status = err.response.status
    const parsed = ApiErrorBodySchema.safeParse(err.response.data)
    const body = parsed.success ? parsed.data : null
    if (status === 401) onUnauthenticated()

    return Promise.reject(
      new ApiError(
        body?.code ?? byStatus(status),
        body?.message ?? 'Erro inesperado',
        status,
        body?.fieldErrors,
        body?.detail,
      ),
    )
  },
)