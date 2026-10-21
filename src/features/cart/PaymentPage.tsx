import { useState } from 'react'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { PaymentMobile } from './PaymentMobile'
import { useNavigate } from '@tanstack/react-router'
import { OrderConfirmationDialog } from './OrderConfirmationDialog'
import { OrderSummary } from './OrderSummary'
import { cartStore, eth, useCart } from './cartStore'

const input =
  'mt-1 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring'

function Field({ id, label, required = true, children }: { id: string; label: string; required?: boolean; children?: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm">
        {label}
        {required && <span className="ml-0.5 text-destructive" aria-hidden="true">*</span>}
      </label>
      {children ?? <input id={id} name={id} required={required} className={input} />}
    </div>
  )
}

const wallets = ['WalletConnect', 'MetaMask', 'Coinbase Wallet']

function PaymentDesktop() {
  const navigate = useNavigate()
  const { items, fee, total } = useCart()
  const [wallet, setWallet] = useState('Coinbase Wallet')
  const [done, setDone] = useState<null | { items: typeof items; fee: number; total: number }>(null)

  function confirm(e: React.FormEvent) {
    e.preventDefault()
    setDone({ items, fee, total })
  }

  function close() {
    cartStore.clear()
    void navigate({ to: '/' })
  }

  return (
    <form onSubmit={confirm}>
      <p className="mb-6 text-sm font-bold">Início / Mercado / Pagamento</p>

      <div className="grid gap-10 lg:grid-cols-[1fr_405px]">
        <section aria-labelledby="perfil">
          <h1 id="perfil" className="mb-3 font-bold">Perfil do colecionador</h1>
          <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
            <Field id="displayName" label="Nome de exibição" />
            <Field id="username" label="Nome de usuário" />
            <Field id="network" label="Rede">
              <select id="network" required defaultValue="" className={input}>
                <option value="" disabled>Selecione uma rede</option>
                <option>Ethereum</option><option>Polygon</option><option>Solana</option>
              </select>
            </Field>
            <Field id="profileName" label="Nome do perfil" />
            <Field id="address" label="Endereço da carteira">
              <input id="address" required placeholder="Endereço 0x da carteira" className={input} />
            </Field>
            <div className="md:pt-6">
              <input aria-label="ENS ou carteira secundária" placeholder="ENS ou carteira secundária (opcional)" className={input} />
            </div>
            <Field id="walletType" label="Tipo de carteira">
              <select id="walletType" required defaultValue="" className={input}>
                <option value="" disabled>Selecione uma carteira</option>
                {wallets.map((w) => <option key={w}>{w}</option>)}
              </select>
            </Field>
            <Field id="referral" label="Código de indicação" />
            <Field id="email" label="E-mail">
              <input id="email" type="email" required className={input} />
            </Field>
            <Field id="ens" label="Nome ENS">
              <div className="flex gap-2">
                <select aria-label="Domínio" className={`${input} w-24`}><option>.eth</option></select>
                <input id="ens" required className={input} />
              </div>
            </Field>
          </div>

          <label className="mt-6 flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-[var(--brand)]" /> Usar outra carteira?
          </label>
          <div className="mt-6">
            <label htmlFor="note" className="text-sm">Observação do colecionador (opcional)</label>
            <textarea id="note" rows={6} className={`${input} max-w-[350px]`} />
          </div>
        </section>

        <aside aria-label="Resumo do pedido">
          <h2 className="font-bold">Seus NFTs</h2>
          <ul className="mt-3 space-y-2">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-3 bg-card p-1.5 text-sm">
                <img src={i.image} alt="" className="size-[70px] object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{i.name}</p>
                  <p className="text-xs text-muted-foreground">ID do token: {i.tokenId}</p>
                </div>
                <span>(x {i.qty})</span>
                <span className="font-bold text-brand">{eth(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4"><OrderSummary /></div>

          <fieldset className="mt-6 space-y-3">
            <legend className="mb-3 w-full text-center font-bold">Carteira e rede</legend>
            {wallets.map((w) => (
              <label key={w} className={`flex cursor-pointer items-center gap-3 border px-3 py-3 ${wallet === w ? 'border-foreground' : 'border-border'}`}>
                <input type="radio" name="wallet" value={w} checked={wallet === w} onChange={() => setWallet(w)} className="accent-[var(--brand)]" />
                {w}
              </label>
            ))}
          </fieldset>

          <button
            type="submit"
            disabled={items.length === 0}
            className="mt-6 w-full bg-primary py-3 font-bold text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            Confirmar compra
          </button>
        </aside>
      </div>

      {done && <OrderConfirmationDialog {...done} wallet={wallet} onClose={close} />}
    </form>
  )
}

export function PaymentPage() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  return isDesktop ? <PaymentDesktop /> : <PaymentMobile />
}
