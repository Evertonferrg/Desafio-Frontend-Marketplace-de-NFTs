import { useState } from 'react'
import { Link, useSearch } from '@tanstack/react-router'
import { useNfts } from '@/features/catalog/hooks'
import { formatEth } from '@/lib/money'

// Contagens de exemplo (iguais às do design). A API de mock não devolve totais por coleção.
export const COLLECTIONS = [
  { name: 'Arte digital', count: 33 },
  { name: 'Fotografia', count: 12 },
  { name: 'Música', count: 65 },
  { name: 'Arte 3D', count: 39 },
  { name: 'Colecionáveis', count: 23 },
  { name: 'Generativa', count: 17 },
  { name: 'Jogos', count: 19 },
  { name: 'Assinaturas', count: 13 },
  { name: 'Utilidade', count: 18 },
]

const NETWORKS = [
  { name: 'Ethereum', count: 119 },
  { name: 'Polygon', count: 78 },
  { name: 'Solana', count: 86 },
]

const box = 'bg-card p-4'
const title = 'mb-3 font-bold'

function FeaturedNft() {
  const { data } = useNfts({ sort: 'recent', page: 1, pageSize: 3 })
  const nft = data?.items[1] ?? data?.items[0]
  if (!nft) return null

  return (
    <section aria-labelledby="featured" className="overflow-hidden bg-secondary">
      <div className="p-4 pb-3">
        <h2 id="featured" className="font-bold uppercase text-brand">NFT em destaque</h2>
        <p className="mt-2 text-center font-bold uppercase">Oferta limitada</p>
      </div>
      <Link to="/nft/$id" params={{ id: nft.id }} className="block outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <img src={nft.image} alt={nft.name} loading="lazy" className="aspect-[0.85] w-full rounded-t-2xl object-cover" />
        <span className="sr-only">{nft.name}, {formatEth(nft.price)}</span>
      </Link>
    </section>
  )
}

export function HomeSidebar({ showFeatured = true }: { showFeatured?: boolean }) {
  const { category } = useSearch({ strict: false }) as { category?: string }
  const [min, setMin] = useState(2)
  const [max, setMax] = useState(60)

  return (
    <aside aria-label="Filtros" className="space-y-6">
      <section className={box} aria-labelledby="col">
        <h2 id="col" className={title}>Coleções</h2>
        <ul>
          {COLLECTIONS.map((c) => {
            const active = category === c.name
            return (
              <li key={c.name}>
                <Link
                  to="/"
                  hash="catalogo"
                  search={(prev: Record<string, unknown>) => ({ ...prev, category: active ? undefined : c.name, page: 1 })}
                  aria-current={active ? 'true' : undefined}
                  className={`flex justify-between rounded px-3 py-1.5 text-sm text-brand outline-none hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-ring ${active ? 'bg-surface-2 font-bold' : ''}`}
                >
                  <span>{c.name}</span>
                  <span className="font-bold">({c.count})</span>
                </Link>
              </li>
            )
          })}
        </ul>

        <h2 className={`${title} mt-6`}>Faixa de preço</h2>
        <div className="space-y-3 px-1">
          <label className="block text-xs">
            <span className="sr-only">Preço mínimo</span>
            <input type="range" min={0} max={100} value={min} onChange={(e) => setMin(Math.min(Number(e.target.value), max))} className="w-full accent-[var(--brand)]" />
          </label>
          <label className="block text-xs">
            <span className="sr-only">Preço máximo</span>
            <input type="range" min={0} max={100} value={max} onChange={(e) => setMax(Math.max(Number(e.target.value), min))} className="w-full accent-[var(--brand)]" />
          </label>
          <p className="text-xs">Preço: {(min / 100 * 12.3).toFixed(2).replace('.', ',')} - {(max / 100 * 12.3).toFixed(2).replace('.', ',')} ETH</p>
          {/* Visual por enquanto: a API (CatalogQuery) ainda não tem filtro de preço */}
          <button type="button" className="rounded bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground">Aplicar</button>
        </div>

        <h2 className={`${title} mt-6`}>Rede</h2>
        <ul>
          {NETWORKS.map((n) => (
            <li key={n.name} className="flex justify-between px-3 py-1.5 text-sm text-muted-foreground">
              <span>{n.name}</span><span>({n.count})</span>
            </li>
          ))}
        </ul>
      </section>

      {showFeatured && <FeaturedNft />}
    </aside>
  )
}
