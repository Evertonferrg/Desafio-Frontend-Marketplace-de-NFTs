import { Link } from '@tanstack/react-router'
import type { Nft } from '@/contracts'
import { formatEth } from '@/lib/money'

export function NftCard({ nft }: { nft: Nft}) {
    const soldOut = nft.editionsAvailable === 0
    return (
        <Link 
            to="/nft/$id"
            params={{ id: nft.id }}
            className="group block overflow-hidden rounded-xl border bg-card outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
        >
            <div className="relative aspect-square overflow-hidden bg-muted">
                <img src={nft.image}
                alt={nft.name}
                width={600}
                height={600}
                loading="lazy"
                className="h-full w-full object-cover transiion group-hover:scale-105"
            />
            {soldOut && (
                <span className="absolute left-2 top 2 rounded-md bg-forreground px-2 px-1 text-xs font-medium text-background">
                    Esgotado
                </span>
            )}
            </div>
            <div className="space-y-1 p-3">
                <p className="truncate text-xs text-muted-foreground">{nft.collection}</p>
                <h3 className="truncate text-sm font-semibold">{nft.name}</h3>
                <p className="text-sm">{formatEth(nft.price)}</p>
            </div>
        </Link>   
    )
}