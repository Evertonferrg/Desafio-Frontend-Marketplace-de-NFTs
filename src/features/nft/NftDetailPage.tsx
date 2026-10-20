import { useState } from 'react'
import { Link, getRouteApi, useCanGoBack, useRouter } from '@tanstack/react-router'
import { ApiError, type Nft } from '@/contracts'
import { Button } from '@/components/ui/button'
import { formatEth, mulEth } from '@/lib/money'
import { useNft } from './hooks'
import { FavoriteButton } from './components/FavoriteButton'
import { Gallery } from './components/Gallery'
import { NftDetailSkeleton } from './components/NftDetailSkeleton'
import { QuantityStepper } from './components/QuantityStepper'

const route = getRouteApi('/nft/$id')

export function NftDetailPage() {
  const { id } = route.useParams()
  const { data: nft, isPending, isError, error, refetch } = useNft(id)

  return (
    <div className="space-y-6">
      <BackLink />
      {isPending ? (
        <NftDetailSkeleton />
      ) : isError ? (
        error instanceof ApiError && error.code === 'NOT_FOUND' ? (
          <div role="alert" className="rounded-xl border p-8 text-center">
            <h1 className="text-xl font-bold">NFT não encontrado</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              O item que você procura não existe ou foi removido.
            </p>
            <Link to="/" className="mt-4 inline-block underline">
              Voltar ao catálogo
            </Link>
          </div>
        ) : (
          <div role="alert" className="rounded-xl border p-8 text-center">
            <p className="font-medium">Não foi possível carregar este NFT.</p>
            <Button className="mt-4" onClick={() => void refetch()}>
              Tentar novamente
            </Button>
          </div>
        )
      ) : (
        <NftDetail key={nft.id} nft={nft} />
      )}
    </div>
  )
}

function BackLink() {
  const router = useRouter()
  const canGoBack = useCanGoBack()
  // volta no histórico quando possível, preservando busca e filtros do catálogo
  return canGoBack ? (
    <button type="button" onClick={() => router.history.back()} className="text-sm underline">
      ← Voltar
    </button>
  ) : (
    <Link to="/" className="text-sm underline">
      ← Catálogo
    </Link>
  )
}

function NftDetail({ nft }: { nft: Nft }) {
  const soldOut = nft.editionsAvailable === 0
  const maxQty = Math.min(nft.maxPerOrder, nft.editionsAvailable)
  const [qty, setQty] = useState(1)
  const [note, setNote] = useState('')

  return (
    <article className="grid gap-8 md:grid-cols-2">
      <Gallery images={nft.gallery.length ? nft.gallery : [nft.image]} name={nft.name} />

      <div className="space-y-5">
        <div>
          <p className="text-sm text-muted-foreground">
            {nft.collection} · {nft.category}
          </p>
          <h1 className="mt-1 text-3xl font-bold">{nft.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Criado por {nft.creator}</p>
        </div>

        <p>{nft.description}</p>

        <div>
          <p className="text-sm text-muted-foreground">Preço unitário</p>
          <p className="text-2xl font-semibold">{formatEth(nft.price)}</p>
        </div>

        {soldOut ? (
          <p role="status" className="rounded-lg border p-3 font-medium">
            Esgotado
          </p>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {nft.editionsAvailable} {nft.editionsAvailable === 1 ? 'edição disponível' : 'edições disponíveis'}
              {' · '}máximo de {nft.maxPerOrder} por pedido
            </p>
            <QuantityStepper value={qty} max={maxQty} onChange={setQty} />
            <p className="text-sm">
              Total: <strong>{formatEth(mulEth(nft.price, qty))}</strong>
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-start gap-3">
          <Button
            disabled={soldOut}
            onClick={() => setNote(`${qty} × ${nft.name} pronto para o carrinho (o carrinho entra no próximo passo).`)}
          >
            Adicionar ao carrinho
          </Button>
          <FavoriteButton nftId={nft.id} />
        </div>

        <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
          {note}
        </p>
      </div>
    </article>
  )
}