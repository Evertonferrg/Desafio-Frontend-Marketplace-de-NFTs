import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Heart, Minus, Plus, ShoppingCart } from 'lucide-react'
import type { Nft } from '@/contracts'
import { cartStore } from '@/features/cart/cartStore'
import { formatEth } from '@/lib/money'

const EDITIONS = ['1/1', '1/10', '1/50', 'ABERTA']
const step = 'grid size-8 place-items-center rounded-full bg-primary text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40'

// Edição, quantidade, Comprar e Favoritar. No celular a barra de compra fica fixa no rodapé.
export function BuyActions({ nft }: { nft: Nft }) {
  const navigate = useNavigate()
  const [edition, setEdition] = useState('1/50')
  const [qty, setQty] = useState(1)
  const [fav, setFav] = useState(false)
  const [added, setAdded] = useState(false)
  const soldOut = nft.editionsAvailable === 0
  const max = Math.max(1, Math.min(nft.maxPerOrder ?? 3, nft.editionsAvailable || 1))

  function buy() {
    cartStore.add(nft, qty, edition)
    void navigate({ to: '/cart' })
  }

  function addOnly() {
    cartStore.add(nft, qty, edition)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="mb-2 text-sm font-bold">Edição:</legend>
        <div className="flex flex-wrap gap-2">
          {EDITIONS.map((e) => (
            <button
              key={e}
              type="button"
              aria-pressed={edition === e}
              onClick={() => setEdition(e)}
              className={`rounded-full border px-3 py-1 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring ${edition === e ? 'border-brand text-brand' : 'border-border'}`}
            >
              {e}
            </button>
          ))}
        </div>
      </fieldset>

      {/* espaço para a barra fixa não cobrir o conteúdo */}
      <div className="h-40 md:hidden" aria-hidden="true" />

      <div className="fixed inset-x-0 bottom-0 z-40 space-y-4 rounded-t-3xl bg-card p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:static md:z-auto md:flex md:flex-wrap md:items-center md:justify-between md:gap-4 md:space-y-0 md:rounded-none md:bg-transparent md:p-0">
        <div className="flex items-center justify-between gap-4 md:justify-start">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold md:hidden">Qtd.</span>
            <button type="button" aria-label="Diminuir quantidade" disabled={qty <= 1} onClick={() => setQty((q) => q - 1)} className={step}>
              <Minus className="size-4" />
            </button>
            <span aria-live="polite" className="w-4 text-center">{qty}</span>
            <button type="button" aria-label="Aumentar quantidade" disabled={qty >= max} onClick={() => setQty((q) => q + 1)} className={step}>
              <Plus className="size-4" />
            </button>
          </div>
            <span className="text-xl font-bold text-brand md:hidden"> 
              {formatEth((Number(nft.price) * qty).toFixed(3))}
            </span>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={buy}
            disabled={soldOut}
            className="flex-1 rounded-full bg-gradient-to-r from-primary to-[#a8703e] py-3.5 text-sm font-bold text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 md:flex-none md:rounded-none md:bg-primary md:bg-none md:px-8 md:py-2.5 md:uppercase"
          >
            {soldOut ? 'Esgotado' : (<><span className="md:hidden">Comprar NFT</span><span className="hidden md:inline">Comprar</span></>)}
          </button>

          <button
            type="button"
            onClick={addOnly}
            disabled={soldOut}
            aria-label="Adicionar ao carrinho"
            className="grid size-12 place-items-center rounded-full bg-secondary text-brand outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 md:hidden"
          >
            <ShoppingCart className="size-5" />
          </button>
          <span role="status" className="sr-only">{added ? 'Adicionado ao carrinho' : ''}</span>

          <button
            type="button"
            aria-pressed={fav}
            onClick={() => setFav((f) => !f)}
            className="hidden items-center gap-2 border border-brand px-4 py-2.5 text-sm text-brand outline-none focus-visible:ring-2 focus-visible:ring-ring md:flex"
          >
            <Heart className={`size-4 ${fav ? 'fill-brand' : ''}`} /> Favoritar
          </button>
        </div>
      </div>
    </div>
  )
}
