import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { eth, type CartItem } from './cartStore'

type Props = {
  items: CartItem[]
  fee: number
  total: number
  wallet: string
  onClose: () => void
}

export function OrderConfirmationDialog({ items, fee, total, wallet, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="order-title" className="relative w-full max-w-[578px] border-b-8 border-brand bg-card">
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Fechar" className="absolute right-4 top-4 text-brand">
          <X className="size-5" />
        </button>

        <header className="border-b border-brand/60 px-6 py-8 text-center">
          <h2 id="order-title" className="font-bold text-muted-foreground">Seus NFTs agora estão na sua carteira</h2>
        </header>

        <dl className="grid grid-cols-2 gap-4 border-b border-brand/60 px-6 py-4 text-xs md:grid-cols-4">
          <div><dt className="font-bold">ID da transação</dt><dd className="text-muted-foreground">0xA91F…E82C</dd></div>
          <div><dt>Data</dt><dd className="text-muted-foreground">{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}</dd></div>
          <div><dt>Total</dt><dd className="text-muted-foreground">{eth(total, 3)}</dd></div>
          <div><dt className="font-bold">Carteira</dt><dd className="text-muted-foreground">{wallet}</dd></div>
        </dl>

        <div className="px-6 py-5">
          <h3 className="text-sm font-bold">Detalhes da transação</h3>
          <ul className="mt-3 space-y-3 text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-3">
                <img src={i.image} alt="" className="size-14 rounded object-cover" />
                <div className="flex-1">
                  <p className="font-bold">{i.name}</p>
                  <p className="text-xs text-muted-foreground">ID do token: {i.tokenId}</p>
                </div>
                <span>(x {i.qty})</span>
                <span className="w-24 text-right font-bold text-brand">{eth(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1 border-b border-border pb-3 text-sm">
            <div className="flex justify-between"><dt>Taxa de rede</dt><dd>{eth(fee, 3)}</dd></div>
            <div className="flex justify-between font-bold"><dt>Total</dt><dd className="text-brand">{eth(total, 3)}</dd></div>
          </dl>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Transação confirmada na Ethereum. A propriedade foi transferida para sua carteira conectada e registrada na rede.
          </p>
          <div className="mt-5 text-center">
            <button type="button" className="bg-primary px-6 py-3 font-bold text-primary-foreground">Ver no Etherscan</button>
          </div>
        </div>
      </div>
    </div>
  )
}
