import { http as rest, HttpResponse } from 'msw'
import { db, persist } from '../db'
import { getScenario } from '../scenarios'
import { apiError, authenticate, gate } from './common'

export const favoriteHandlers = [
  rest.get('/api/favorites', async ({ request }) => {
    const blocked = await gate(request)
    if (blocked) return blocked
    const auth = authenticate(request)
    if (auth instanceof Response) return auth
    return HttpResponse.json(db.favorites[auth.userId] ?? [])
  }),

  rest.put('/api/favorites/:id', async ({ request, params }) => {
    const blocked = await gate(request)
    if (blocked) return blocked
    const auth = authenticate(request)
    if (auth instanceof Response) return auth

    // cenário para testar update otimista + rollback
    if (getScenario() === 'favorites-fail') {
      return apiError(500, { code: 'TRANSIENT', message: 'Falha ao favoritar' })
    }
    const id = String(params.id)
    if (!db.nfts.some((n) => n.id === id)) {
      return apiError(404, { code: 'NOT_FOUND', message: 'NFT não encontrado' })
    }
    const set = new Set(db.favorites[auth.userId] ?? [])
    set.add(id)
    db.favorites[auth.userId] = [...set]
    persist()
    return HttpResponse.json(db.favorites[auth.userId])
  }),

  rest.delete('/api/favorites/:id', async ({ request, params }) => {
    const blocked = await gate(request)
    if (blocked) return blocked
    const auth = authenticate(request)
    if (auth instanceof Response) return auth

    if (getScenario() === 'favorites-fail') {
      return apiError(500, { code: 'TRANSIENT', message: 'Falha ao remover favorito' })
    }
    db.favorites[auth.userId] = (db.favorites[auth.userId] ?? []).filter((x) => x !== params.id)
    persist()
    return HttpResponse.json(db.favorites[auth.userId])
  }),
]