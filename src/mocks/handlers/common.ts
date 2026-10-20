import { HttpResponse, delay } from 'msw'
import type { ApiErrorBody } from '@/contracts'
import { db, ready } from '../db'
import { getScenario } from '../scenarios'

export const apiError = (status: number, body: ApiErrorBody) =>
    HttpResponse.json(body, { status })

//latencia determinada
const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)

/* Aplica o cenario ativo */
export async function gate(request: Request): Promise<Response | undefined> {
    await ready
    const sc = getScenario()
    if (sc === 'network-error') return HttpResponse.error()
    if (sc === 'server-error') {
        return apiError(503, { code: 'TRANSIENT', message: 'Serviço indisponivel' })
    }
    if (sc === 'slow') await delay(300 + (hash(request.url) % 5) * 700)
    else await delay(120)
    return undefined
}

export const bearer = (request: Request) =>
    request.headers.get('Authorization')?.replace('Bearer ', '')

/* devolve id */
export function authenticate(request: Request): { userId: string } | Response {
    if (getScenario() === 'session-expired') {
        return apiError(401, { code: 'UNAUTHENTICATED', message: 'Sessão expirada' })
    }
    const token = bearer(request)
    const s = db.sessions.find((x) => x.token === token)
    if (!s || s.expiresAt < Date.now()) {
        return apiError(401, { code: 'UNAUTHENTICATED', message: 'Sessão inválida ou expirada'  })
    }
    return { userId: s.userId}
}