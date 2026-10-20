import { NftSchema, PageSchema } from '@/contracts'
import { http } from '@/lib/http'
import type { CatalogQuery } from './search'

const NftPageSchema = PageSchema(NftSchema)

export async function fetchNfts(params: CatalogQuery, signal?: AbortSignal) {
  const { data } = await http.get('/nfts', { params, signal })
  return NftPageSchema.parse(data)
}
