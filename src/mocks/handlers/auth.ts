import { http as rest, HttpResponse } from 'msw'
import { LoginInputSchema, SignupInputSchema, type AuthResponse } from '@/contracts'
import { db, persist, sha256 } from '../db'
import { apiError, authenticate, bearer, gate } from './common'

const SESSION_MS = 30 * 60 * 1000

function fieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  return Object.fromEntries(issues.map((i) => [String(i.path[0]), i.message]))
}

function publicUser(userId: string) {
  const found = db.users.find((u) => u.id === userId)!
  return { id: found.id, name: found.name, email: found.email, avatarUrl: found.avatarUrl }
}

function openSession(userId: string): AuthResponse {
  const token = crypto.randomUUID()
  const expiresAt = Date.now() + SESSION_MS
  db.sessions.push({ token, userId, expiresAt })
  persist()
  return { token, session: { user: publicUser(userId), expiresAt: new Date(expiresAt).toISOString() } }
}

export const authHandlers = [
  rest.post('/api/auth/signup', async ({ request }) => {
    const blocked = await gate(request)
    if (blocked) return blocked

    const parsed = SignupInputSchema.safeParse(await request.json())
    if (!parsed.success) {
      return apiError(422, {
        code: 'VALIDATION',
        message: 'Dados inválidos',
        fieldErrors: fieldErrors(parsed.error.issues),
      })
    }
    const { name, email, password } = parsed.data
    if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return apiError(409, {
        code: 'CONFLICT',
        message: 'E-mail já cadastrado',
        fieldErrors: { email: 'E-mail já cadastrado' },
      })
    }
    const id = `u${db.users.length + 1}`
    db.users.push({ id, name, email, avatarUrl: null, passwordHash: await sha256(password) })
    return HttpResponse.json(openSession(id), { status: 201 })
  }),

  rest.post('/api/auth/login', async ({ request }) => {
    const blocked = await gate(request)
    if (blocked) return blocked

    const parsed = LoginInputSchema.safeParse(await request.json())
    if (!parsed.success) {
      return apiError(422, {
        code: 'VALIDATION',
        message: 'Dados inválidos',
        fieldErrors: fieldErrors(parsed.error.issues),
      })
    }
    const user = db.users.find((u) => u.email.toLowerCase() === parsed.data.email.toLowerCase())
    // 422 (e não 401) para o interceptor não confundir senha errada com sessão expirada
    if (!user || user.passwordHash !== (await sha256(parsed.data.password))) {
      return apiError(422, {
        code: 'VALIDATION',
        message: 'E-mail ou senha incorretos',
        fieldErrors: { password: 'E-mail ou senha incorretos' },
      })
    }
    return HttpResponse.json(openSession(user.id))
  }),

  rest.get('/api/session', async ({ request }) => {
    const blocked = await gate(request)
    if (blocked) return blocked
    const auth = authenticate(request)
    if (auth instanceof Response) return auth

    const s = db.sessions.find((x) => x.token === bearer(request))!
    return HttpResponse.json({
      user: publicUser(auth.userId),
      expiresAt: new Date(s.expiresAt).toISOString(),
    })
  }),

  rest.post('/api/auth/logout', async ({ request }) => {
    await gate(request)
    const token = bearer(request)
    db.sessions = db.sessions.filter((s) => s.token !== token)
    persist()
    return new HttpResponse(null, { status: 204 })
  }),
]