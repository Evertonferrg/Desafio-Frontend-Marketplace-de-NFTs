import { Link } from '@tanstack/react-router'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { OrderSummary } from './OrderSummary'
import { cartStore, eth, useCart } from './cartStore'

const stepBtn =
  'grid size-6 place-items-center rounded-full bg-primary text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40'

export function CartPage() {
  const { items } = useCart()

  return (
    <div>
      <p className="mb-4 text-sm font-bold">Início / Mercado / Carrinho</p>
      <h1 className="sr-only">Carrinho de NFTs</h1>

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

            <ul className="mt-3 space-y-3">
              {items.map((i) => (
                <li
                  key={i.id}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 bg-card p-2 md:grid-cols-[2.2fr_1fr_1fr_1fr_40px] md:p-1.5"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <img src={i.image} alt="" className="size-[70px] shrink-0 object-cover" />
                    <div className="min-w-0">
                      <p className="truncate font-bold">{i.name}</p>
                      <p className="text-xs text-muted-foreground">
                        <span className="md:hidden">Edição: {i.edition}</span>
                        <span className="hidden md:inline">ID do token: {i.tokenId}</span>
                      </p>
                      <p className="mt-1 font-bold text-brand md:hidden">{eth(i.price)}</p>
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
                    className="justify-self-end rounded p-2 text-brand outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <aside aria-label="Resumo da carteira">
            <h2 className="mb-4 border-b border-border pb-2 font-bold">Resumo da carteira</h2>
            <OrderSummary withPromo>
              <Link
                to="/payment"
                className="mt-5 block bg-primary py-3 text-center font-bold text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Conectar e finalizar
              </Link>
              <Link to="/" className="mt-3 block text-center text-brand">Continuar explorando</Link>
            </OrderSummary>
          </aside>
        </div>
      )}
    </div>
  )
}
