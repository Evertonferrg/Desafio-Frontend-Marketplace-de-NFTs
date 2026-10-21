import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Heart, Search, ShoppingCart } from 'lucide-react'
import type { Nft } from '@/contracts'
import { cartStore } from '@/features/cart/cartStore'
import { formatEth } from '@/lib/money'

const action =
  'grid size-9 place-items-center rounded bg-card/90 text-foreground outline-none hover:text-brand focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40'

export function NftCard({ nft }: { nft: Nft }) {
  const soldOut = nft.editionsAvailable === 0
  const [fav, setFav] = useState(false)

  return (
    <article className="group rounded-lg bg-card p-3">
      <div className="relative aspect-square overflow-hidden rounded-md bg-surface-2">
        <Link
          to="/nft/$id"
          params={{ id: nft.id }}
          aria-label={`Ver ${nft.name}`}
          className="block size-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <img
            src={nft.image}
            alt={nft.name}
            width={600}
            height={600}
            loading="lazy"
            className="size-full object-cover transition group-hover:scale-105"
          />
        </Link>

        {soldOut && (
          <span className="absolute left-2 top-2 rounded bg-foreground px-2 py-1 text-xs font-semibold text-background">
            Esgotado
          </span>
        )}

        {/* No celular os botões ficam sempre visíveis; no desktop aparecem no hover/foco */}
        <div className="absolute inset-x-0 bottom-2 flex justify-center gap-2 transition md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
          <button type="button" disabled={soldOut} aria-label={`Adicionar ${nft.name} ao carrinho`} onClick={() => cartStore.add(nft)} className={action}>
            <ShoppingCart className="size-4" />
          </button>
          <button type="button" aria-pressed={fav} aria-label={fav ? 'Remover dos favoritos' : 'Favoritar'} onClick={() => setFav((f) => !f)} className={action}>
            <Heart className={`size-4 ${fav ? 'fill-brand text-brand' : ''}`} />
          </button>
          <Link to="/nft/$id" params={{ id: nft.id }} aria-label={`Ver detalhes de ${nft.name}`} className={action}>
            <Search className="size-4" />
          </Link>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="truncate text-sm">{nft.name}</h3>
        <p className="text-sm font-semibold text-brand">{formatEth(nft.price)}</p>
      </div>
    </article>
  )
}
