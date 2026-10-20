import { Button } from '@/components/ui/button'
import { useSession } from '@/features/auth/session'
import { useFavorites, useToggleFavorite } from '../hooks'

export function FavoriteButton({ nftId }: { nftId: string }) {
  const session = useSession()
  const favorites = useFavorites()
  const toggle = useToggleFavorite()

  if (!session) {
    return <p className="text-sm text-muted-foreground">Entre na sua conta para favoritar.</p>
  }

  const isFavorite = favorites.data?.includes(nftId) ?? false

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        aria-pressed={isFavorite}
        disabled={favorites.isPending}
        onClick={() => toggle.mutate({ id: nftId, favorite: !isFavorite })}
      >
        {isFavorite ? '♥ Favoritado' : '♡ Favoritar'}
      </Button>
      {toggle.isError && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          Não foi possível atualizar o favorito. Tente novamente.
        </p>
      )}
    </div>
  )
}