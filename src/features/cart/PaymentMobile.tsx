import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Wallet } from 'lucide-react'
import { PageBar } from '@/components/layout/PageBar'
import { OrderConfirmationDialog } from './OrderConfirmationDialog'
import { cartStore, eth, useCart } from './cartStore'

const accounts = [
  { name: 'Reserva', address: 'nova.kurio.eth', network: 'Rede Polygon' },
  { name: 'Principal', address: '0xA91F…E82C', network: 'Rede principal Ethereum' },
]
const wallets = [
  { name: 'WalletConnect', icon: 'W' },
  { name: 'MetaMask', icon: 'M' },
  { name: 'Coinbase Wallet', icon: null },
]

function Radio({ checked }: { checked: boolean }) {
  return (
    <span aria-hidden="true" className={`grid size-5 shrink-0 place-items-center rounded-full border ${checked ? 'border-brand' : 'border-border'}`}>
      {checked && <span className="size-2.5 rounded-full bg-brand" />}
    </span>
  )
}

const card = 'flex cursor-pointer items-center gap-3 rounded-2xl bg-card p-4 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring'

// Versão do pagamento para o celular: escolha de carteira e rede (as informações do perfil ficam no desktop).
export function PaymentMobile() {
  const navigate = useNavigate()
  const { items, fee, total } = useCart()
  const [account, setAccount] = useState('Reserva')
  const [wallet, setWallet] = useState('Coinbase Wallet')
  const [done, setDone] = useState<null | { items: typeof items; fee: number; total: number }>(null)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setDone({ items, fee, total })
      }}
      className="pb-28"
    >
      <PageBar title="Pagamento com carteira" />

      <div className="flex items-center justify-between">
        <h2 className="font-bold">Carteira conectada</h2>
        <button type="button" className="text-sm font-bold text-brand">Trocar carteira</button>
      </div>
      <fieldset className="mt-3 space-y-3">
        <legend className="sr-only">Carteira conectada</legend>
        {accounts.map((a) => (
          <label key={a.name} className={card}>
            <input type="radio" name="account" className="sr-only" checked={account === a.name} onChange={() => setAccount(a.name)} />
            <Radio checked={account === a.name} />
            <span className="flex-1 text-sm">
              <span className="block font-bold">{a.name}</span>
              <span className="block text-muted-foreground">{a.address}</span>
              <span className="block text-muted-foreground">{a.network}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <h2 className="mt-6 font-bold">Carteira e rede</h2>
      <fieldset className="mt-3 space-y-3">
        <legend className="sr-only">Carteira e rede</legend>
        {wallets.map((w) => (
          <label key={w.name} className={card}>
            <input type="radio" name="wallet" className="sr-only" checked={wallet === w.name} onChange={() => setWallet(w.name)} />
            <span className="grid size-10 place-items-center rounded-full bg-secondary font-bold text-brand">
              {w.icon ?? <Wallet className="size-5" />}
            </span>
            <span className="flex-1 text-sm">{w.name}</span>
            <Radio checked={wallet === w.name} />
          </label>
        ))}
      </fieldset>

      <p className="mt-4 text-right">
        <span className="font-bold">Total:</span> <span className="ml-3 font-bold text-brand">{eth(total, 3)}</span>
      </p>

      <div className="fixed inset-x-0 bottom-0 z-40 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          type="submit"
          disabled={items.length === 0}
          className="w-full rounded-full bg-gradient-to-r from-primary to-[#a8703e] py-4 font-bold text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          Confirmar compra
        </button>
      </div>

      {done && (
        <OrderConfirmationDialog
          {...done}
          wallet={wallet}
          onClose={() => {
            cartStore.clear()
            void navigate({ to: '/' })
          }}
        />
      )}
    </form>
  )
}
