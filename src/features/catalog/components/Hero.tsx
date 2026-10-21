import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { useNfts } from '../hooks'

// Os 3 NFTs de maior preço viram os destaques do topo.
const FEATURED = { sort: 'recent', page: 1, pageSize: 3 } as const

function scrollToCatalog() {
  document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
}

export function Hero() {
  const { data, isPending } = useNfts(FEATURED)
  const [index, setIndex] = useState(0)
  const items = data?.items ?? []
  const current = items[index]

  return (
    <section aria-label="Destaques" className="grid items-center gap-8 py-8 md:grid-cols-2 md:py-12">
      <div className="space-y-6 md:pr-8">
        <p className="text-xs tracking-wider">Bem-vindo à Kurio</p>
        <h1 className="text-3xl font-bold uppercase leading-tight md:text-5xl">
          Seja dono do futuro da arte digital
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital
          rara, apoie artistas e tenha uma parte da cultura da internet.
        </p>
        <button
          type="button"
          onClick={scrollToCatalog}
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold uppercase text-primary-foreground outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
        >
          Explorar
        </button>

        {items.length > 1 && (
          <div role="group" aria-label="Escolher destaque" className="flex gap-2">
            {items.map((nft, i) => (
              <button
                key={nft.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Destaque ${i + 1}: ${nft.name}`}
                aria-pressed={i === index}
                className={`h-3 w-3 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  i === index ? 'bg-brand' : 'bg-surface-2'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="w-full max-w-md justify-self-center md:justify-self-end">
        {isPending ? (
          <Skeleton className="aspect-square w-full rounded-2xl" />
        ) : current ? (
          <Link
            to="/nft/$id"
            params={{ id: current.id }}
            aria-label={`Ver ${current.name}`}
            className="block aspect-square overflow-hidden rounded-2xl bg-surface-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <img
              src={current.image}
              alt={current.name}
              width={600}
              height={600}
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          </Link>
        ) : null}
      </div>
    </section>
  )
}
