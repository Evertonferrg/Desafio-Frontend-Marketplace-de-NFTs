import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from '@/features/auth/session'
import { keys } from '@/lib/queryKeys'
import { addFavorite, fetchFavorites, fetchNft, removeFavorite } from './api'

export function useNft(id: string) {
  return useQuery({
    queryKey: keys.nft(id),
    queryFn: ({ signal }) => fetchNft(id, signal),
  })
}

export function useFavorites() {
  const session = useSession()
  const userId = session?.session.user.id
  return useQuery({
    queryKey: keys.favorites(userId ?? 'anon'),
    queryFn: ({ signal }) => fetchFavorites(signal),
    enabled: !!userId,
  })
}

/** Favoritar/desfavoritar com update otimista e rollback se a API falhar. */
export function useToggleFavorite() {
  const qc = useQueryClient()
  const session = useSession()
  const key = keys.favorites(session?.session.user.id ?? 'anon')

  return useMutation({
    mutationFn: ({ id, favorite }: { id: string; favorite: boolean }) =>
      favorite ? addFavorite(id) : removeFavorite(id),

    onMutate: async ({ id, favorite }) => {
      await qc.cancelQueries({ queryKey: key }) // evita que um refetch em andamento sobrescreva
      const previous = qc.getQueryData<string[]>(key)
      qc.setQueryData<string[]>(key, (old = []) =>
        favorite ? [...new Set([...old, id])] : old.filter((x) => x !== id),
      )
      return { previous }
    },

    onError: (_error, _vars, context) => {
      if (context?.previous) qc.setQueryData(key, context.previous) // rollback
    },

    onSettled: () => {
      void qc.invalidateQueries({ queryKey: key }) // reconcilia com o servidor
    },
  })
}