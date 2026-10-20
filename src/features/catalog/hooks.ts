import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { keys } from '@/lib/queryKeys'
import { fetchNfts } from './api'
import type { CatalogQuery } from './search'

export function useNfts(params: CatalogQuery) {
  return useQuery({
    queryKey: keys.nfts(params),
    // o signal cancela a requisição quando os filtros mudam (evita resposta obsoleta)
    queryFn: ({ signal }) => fetchNfts(params, signal),
    placeholderData: keepPreviousData,
  })
}
