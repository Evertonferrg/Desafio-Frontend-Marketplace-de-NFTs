import type { CatalogQuery } from '@/features/catalog/search'

// Toda key inclui os parâmetros que alteram o resultado (inclusive o usuário).
export const keys = {
  nfts: (p: CatalogQuery) => ['nfts', 'list', p] as const,
  nft: (id: string) => ['nfts', 'detail', id] as const,
  favorites: (userId: string) => ['user', userId, 'favorites'] as const,
}