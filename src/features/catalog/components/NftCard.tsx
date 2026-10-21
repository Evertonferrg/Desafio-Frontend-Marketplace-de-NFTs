import { Link } from '@tanstack/react-router'
import type { Nft } from '@/contracts'
import { formatEth } from '@/lib/money'

export function NftCard({ nft }: { nft: Nft }) {
  const soldOut = nft.editionsAvailable === 0
  return (
    <Link
      to="/nft/$id"
      params={{ id: nft.id }}
      className="group block rounded-lg bg-card p-3 outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-square overflow-hidden rounded-md bg-surface-2">
        <img
          src={nft.image}
          alt={nft.name}
          width={600}
          height={600}
          loading="lazy"
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        {soldOut && (
          <span className="absolute left-2 top-2 rounded bg-foreground px-2 py-1 text-xs font-semibold text-background">
            Esgotado
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="truncate text-sm">{nft.name}</h3>
        <p className="text-sm font-semibold text-brand">{formatEth(nft.price)}</p>
      </div>
    </Link>
  )
}