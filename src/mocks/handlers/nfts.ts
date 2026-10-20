import { http as rest, HttpResponse } from 'msw'
import { cmpEth } from '@/lib/money'
import { db } from '../db'
import { getScenario } from '../scenarios'
import { apiError, gate } from './common'

export const nftHandlers = [
  rest.get('/api/nfts', async ({ request }) => {
    const blocked = await gate(request)
    if (blocked) return blocked
    const sp = new URL(request.url).searchParams

    let list = getScenario() === 'empty' ? [] : [...db.nfts]

    const q = sp.get('q')?.trim().toLowerCase()
    if (q) {
      list = list.filter((n) =>
        [n.name, n.collection, n.creator].some((f) => f.toLowerCase().includes(q)),
      )
    }
    const category = sp.get('category')
    if (category) list = list.filter((n) => n.category === category)
    const collection = sp.get('collection')
    if (collection) list = list.filter((n) => n.collection === collection)
    const min = sp.get('minPrice')
    if (min) list = list.filter((n) => cmpEth(n.price, min) >= 0)
    const max = sp.get('maxPrice')
    if (max) list = list.filter((n) => cmpEth(n.price, max) <= 0)

    const sort = sp.get('sort') ?? 'recent'
    list.sort((a, b) =>
      sort === 'price_asc'
        ? cmpEth(a.price, b.price)
        : sort === 'price_desc'
          ? cmpEth(b.price, a.price)
          : sort === 'name'
            ? a.name.localeCompare(b.name)
            : b.id.localeCompare(a.id),
    )

    const pageSize = Math.min(48, Math.max(1, Number(sp.get('pageSize')) || 12))
    const total = list.length
    const totalPages = Math.ceil(total / pageSize)
    const page = Math.max(1, Number(sp.get('page')) || 1)

    return HttpResponse.json({
      items: list.slice((page - 1) * pageSize, page * pageSize),
      page,
      pageSize,
      total,
      totalPages,
    })
  }),

  rest.get('/api/nfts/:id', async ({ request, params }) => {
    const blocked = await gate(request)
    if (blocked) return blocked
    const nft = db.nfts.find((n) => n.id === params.id)
    return nft
      ? HttpResponse.json(nft)
      : apiError(404, { code: 'NOT_FOUND', message: 'NFT não encontrado' })
  }),
]