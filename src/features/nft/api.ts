import { z } from 'zod'
import { NftSchema } from '@/contracts'
import { http } from '@/lib/http'

const FavoritesSchema = z.array(z.string())

export async function fetchNft(id: string, signal?: AbortSignal) {
  const { data } = await http.get(`/nfts/${encodeURIComponent(id)}`, { signal })
  return NftSchema.parse(data)
}

export async function fetchFavorites(signal?: AbortSignal) {
  const { data } = await http.get('/favorites', { signal })
  return FavoritesSchema.parse(data)
}

export async function addFavorite(id: string) {
  const { data } = await http.put(`/favorites/${encodeURIComponent(id)}`)
  return FavoritesSchema.parse(data)
}

export async function removeFavorite(id: string) {
  const { data } = await http.delete(`/favorites/${encodeURIComponent(id)}`)
  return FavoritesSchema.parse(data)
}