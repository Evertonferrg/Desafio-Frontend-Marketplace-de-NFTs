import { Link } from '@tanstack/react-router'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { PageBar } from '@/components/layout/PageBar'
import { NftCarousel } from '@/components/nft/NftCarousel'
import { OrderSummary } from './OrderSummary'
import { cartStore, eth, useCart } from './cartStore'

const stepBtn =
  'grid size-6 place-items-center rounded-full bg-primary text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40'

export function CartPage() {
  const { items } = useCart()

  return (
    <div className={items.length ? 'pb-96 md:pb-0' : ''}>
      <PageBar title="Carrinho de NFTs" />
      <p className="mb-4 hidden text-sm font-bold md:block">Início / Mercado / Carrinho</p>
      <h1 className="sr-only max-md:hidden">Carrinho de NFTs</h1>

      {items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg font-bold">Seu carrinho está vazio</p>
          <Link to="/" className="mt-4 inline-block text-brand underline">Explorar NFTs</Link>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_332px]">
          <section aria-label="Itens do carrinho">
            <div className="hidden grid-cols-[2.2fr_1fr_1fr_1fr_40px] border-b border-border pb-2 text-sm font-bold md:grid">
              <span>NFTs</span><span>Preço</span><span>Edições</span><span>Total</span><span />
            </div>

            <ul className="space-y-3 md:mt-3">
              {items.map((i) => (
                <li
                  key={i.id}
                  className="grid grid-cols-[1fr_auto_auto] items-stretch gap-x-3 overflow-hidden rounded-xl bg-card pr-3 md:grid-cols-[2.2fr_1fr_1fr_1fr_40px] md:items-center md:gap-x-4 md:rounded-none md:p-1.5 md:pr-1.5"
                >
                  <div className="flex min-w-0 items-stretch gap-3 md:items-center md:gap-4">
                    <img src={i.image} alt="" className="w-24 shrink-0 object-cover md:size-[70px]" />
                    <div className="min-w-0 py-3 md:py-0">
                      <p className="break-words font-bold">{i.name}</p>
                      <p className="text-xs text-muted-foreground">
                        <span className="md:hidden">Edição: {i.edition}</span>
                        <span className="hidden md:inline">ID do token: {i.tokenId}</span>
                      </p>
                      <p className="mt-2 text-lg font-bold text-brand md:hidden">{eth(i.price * i.qty)}</p>
                    </div>
                  </div>

                  <p className="hidden font-bold text-brand md:block">{eth(i.price)}</p>

                  <div className="flex items-center gap-3">
                    <button type="button" aria-label="Diminuir quantidade" disabled={i.qty <= 1} onClick={() => cartStore.setQty(i.id, i.qty - 1)} className={stepBtn}>
                      <Minus className="size-3" />
                    </button>
                    <span aria-live="polite" className="w-4 text-center">{i.qty}</span>
                    <button type="button" aria-label="Aumentar quantidade" onClick={() => cartStore.setQty(i.id, i.qty + 1)} className={stepBtn}>
                      <Plus className="size-3" />
                    </button>
                  </div>

                  <p className="hidden font-bold text-brand md:block">{eth(i.price * i.qty)}</p>
                  <button
                    type="button"
                    aria-label={`Remover ${i.name}`}
                    onClick={() => cartStore.remove(i.id)}
                    className="self-center justify-self-end rounded p-2 text-brand outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* No celular o resumo vira uma folha fixa no rodapé, como no design */}
          <aside
            aria-label="Resumo da carteira"
            className="fixed inset-x-0 bottom-0 z-40 rounded-t-3xl bg-card p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:static md:z-auto md:rounded-none md:bg-transparent md:p-0"
          >
            <h2 className="mb-4 hidden border-b border-border pb-2 font-bold md:block">Resumo da carteira</h2>
            <OrderSummary withPromo>
              <Link
                to="/payment"
                className="mt-5 block rounded-full bg-gradient-to-r from-primary to-[#a8703e] py-3.5 text-center font-bold text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring md:rounded-none md:bg-primary md:bg-none md:py-3"
              >
                Conectar e finalizar
              </Link>
              <Link to="/" className="mt-3 hidden text-center text-brand md:block">Continuar explorando</Link>
            </OrderSummary>
          </aside>
        </div>
      )}

      <NftCarousel title="Colecionadores também viram" className="mt-16 max-md:hidden" />
    </div>
  )
}
