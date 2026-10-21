import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { useNfts } from '../hooks'

// Os 3 NFTs mais recentes viram os destaques do topo.
const FEATURED = { sort: 'recent', page: 1, pageSize: 3 } as const

function scrollToCatalog() {
  document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
}

export function Hero() {
  const { data, isPending } = useNfts(FEATURED)
  const [index, setIndex] = useState(0)
  const items = data?.items ?? []
  const current = items[index]
  const next = items.length > 1 ? items[(index + 1) % items.length] : undefined

  return (
    <section
      aria-label="Destaques"
      className="relative grid grid-cols-[1fr_auto] items-center gap-4 overflow-hidden rounded-2xl bg-secondary/60 p-4 pb-8 md:grid-cols-2 md:gap-8 md:rounded-none md:bg-transparent md:p-0 md:py-12"
    >
      <div className="min-w-0 space-y-3 md:space-y-6 md:pr-8">
        <p className="text-xs tracking-wider">Bem-vindo à Kurio</p>
        <h1 className="text-xl font-bold uppercase leading-tight sm:text-2xl md:text-5xl">
          Seja dono do futuro da arte digital
        </h1>
        <p className="max-w-md text-xs leading-relaxed text-muted-foreground md:text-sm">
          Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital
          rara, apoie artistas e tenha uma parte da cultura da internet.
        </p>
        <button
          type="button"
          onClick={scrollToCatalog}
          className="text-xs font-bold uppercase text-brand outline-none focus-visible:ring-2 focus-visible:ring-ring md:rounded-md md:bg-primary md:px-5 md:py-2.5 md:text-sm md:text-primary-foreground md:hover:opacity-90"
        >
          Explorar <span className="md:hidden">→</span>
        </button>
      </div>

      <div className="relative w-28 sm:w-40 md:w-full md:max-w-md md:justify-self-end">
        {isPending ? (
          <Skeleton className="aspect-square w-full rounded-2xl" />
        ) : current ? (
          <>
            <Link
              to="/nft/$id"
              params={{ id: current.id }}
              aria-label={`Ver ${current.name}`}
              className="block aspect-square overflow-hidden rounded-2xl bg-surface-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <img src={current.image} alt={current.name} width={600} height={600} fetchPriority="high" className="size-full object-cover" />
            </Link>
            {next && (
              <img
                src={next.image}
                alt=""
                aria-hidden="true"
                className="absolute -bottom-3 -left-6 size-12 rounded-xl border-2 border-card object-cover sm:size-16 md:hidden"
              />
            )}
          </>
        ) : null}
      </div>

      {items.length > 1 && (
        <div role="group" aria-label="Escolher destaque" className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 md:static md:col-span-2 md:translate-x-0">
          {items.map((nft, i) => (
            <button
              key={nft.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Destaque ${i + 1}: ${nft.name}`}
              aria-pressed={i === index}
              className={`size-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring md:size-3 ${i === index ? 'bg-brand' : 'bg-surface-2'}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
