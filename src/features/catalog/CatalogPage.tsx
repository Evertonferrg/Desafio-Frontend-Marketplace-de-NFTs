import { useCallback, useEffect } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { ApiError } from '@/contracts'
import { Button } from '@/components/ui/button'
import { useNfts } from './hooks'
import { PAGE_SIZE, type CatalogSearch } from './search'
import { Filters } from './components/Filters'
import { NftCard } from './components/NftCards'
import { NftCardSkeleton } from './components/NftCardSkeleton'
import { Pagination } from './components/Pagination'

const route = getRouteApi('/')

export function CatalogPage() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const params = {
    q: search.q,
    category: search.category,
    sort: search.sort ?? 'recent',
    page: search.page ?? 1,
    pageSize: PAGE_SIZE,
  } as const

  const { data, isPending, isError, error, refetch, isPlaceholderData } = useNfts(params)

  const update = useCallback(
    (patch: Partial<CatalogSearch>, opts?: { replace?: boolean }) => {
      void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: opts?.replace })
    },
    [navigate],
  )

  // página fora do intervalo (ex.: ?page=99): volta para a última válida
  useEffect(() => {
    if (data && data.totalPages > 0 && params.page > data.totalPages) {
      update({ page: data.totalPages > 1 ? data.totalPages : undefined }, { replace: true })
    }
  }, [data, params.page, update])

  return (
    <section aria-labelledby="catalog-title" className="space-y-6">
      <h1 id="catalog-title" className="text-2xl font-bold">
        Explorar NFTs
      </h1>

      <Filters q={search.q} category={search.category} sort={params.sort} onChange={update} />

      {/* anuncia o resultado para leitores de tela */}
      <p className="sr-only" role="status" aria-live="polite">
        {data ? `${data.total} resultados` : 'Carregando'}
      </p>

      {isPending ? (
        <Grid busy>
          {Array.from({ length: PAGE_SIZE }, (_, i) => (
            <NftCardSkeleton key={i} />
          ))}
        </Grid>
      ) : isError ? (
        <div role="alert" className="rounded-xl border p-8 text-center">
          <p className="font-medium">
            {error instanceof ApiError && error.code === 'NETWORK'
              ? 'Sem conexão. Verifique sua internet.'
              : 'Não foi possível carregar os NFTs.'}
          </p>
          <Button className="mt-4" onClick={() => void refetch()}>
            Tentar novamente
          </Button>
        </div>
      ) : data.items.length === 0 ? (
        <div className="rounded-xl border p-8 text-center">
          <p className="font-medium">Nenhum NFT encontrado</p>
          <p className="mt-1 text-sm text-muted-foreground">Ajuste a busca ou os filtros.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => update({ q: undefined, category: undefined, sort: undefined, page: undefined })}
          >
            Limpar filtros
          </Button>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground" aria-hidden="true">
            {data.total} {data.total === 1 ? 'resultado' : 'resultados'}
          </p>
          <Grid busy={isPlaceholderData}>
            {data.items.map((nft) => (
              <NftCard key={nft.id} nft={nft} />
            ))}
          </Grid>
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onPage={(page) => update({ page: page === 1 ? undefined : page })}
          />
        </>
      )}
    </section>
  )
}

function Grid({ children, busy }: { children: React.ReactNode; busy?: boolean }) {
  return (
    <div
      aria-busy={busy}
      className={`grid grid-cols-2 gap-4 transition-opacity md:grid-cols-3 lg:grid-cols-4 ${busy ? 'opacity-60' : ''}`}
    >
      {children}
    </div>
  )
}
