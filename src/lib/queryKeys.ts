import type { CatalogQuery } from '@/features/catalog/search'


export const keys = {
  nfts: (p: CatalogQuery) => ['nfts', 'list', p] as const,
  nft: (id: string) => ['nfts', 'detail', id] as const,
}
