import { useState } from 'react'
import { EnsField, Field, SelectField, inputClass, primaryButton } from '@/components/ui/form'

export function WalletsPage() {
  const [saved, setSaved] = useState(false)
  const [sameAsMain, setSameAsMain] = useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: enviar a carteira para a API
    setSaved(true)
  }

  return (
    <div className="max-w-[862px]">
      <form onSubmit={onSubmit}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-bold">Carteira principal</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.
            </p>
          </div>
          <button type="button" className="font-bold text-brand outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Adicionar
          </button>
        </div>

        <div className="mt-6 grid gap-x-6 gap-y-5 md:grid-cols-2">
          <Field id="displayName" label="Nome de exibição" required />
          <Field id="walletNick" label="Apelido da carteira" required />
          <SelectField id="network" label="Rede" placeholder="Selecione uma rede" options={['Ethereum', 'Polygon', 'Solana']} required />
          <Field id="profileName" label="Nome do perfil" required />
          <Field id="address" label="Endereço da carteira" required placeholder="Endereço 0x da carteira" />
          <div className="md:pt-6">
            <input aria-label="ENS ou carteira secundária" placeholder="ENS ou carteira secundária (opcional)" className={inputClass} />
          </div>
          <SelectField id="walletType" label="Tipo de carteira" placeholder="Selecione uma carteira" options={['MetaMask', 'WalletConnect', 'Coinbase Wallet']} required />
          <Field id="referral" label="Código de indicação" required />
          <Field id="email" label="E-mail" type="email" required />
          <EnsField id="ens" />
        </div>

        <div className="mt-8 flex items-center gap-4">
          <button type="submit" className={primaryButton}>Salvar carteira</button>
          <p role="status" className="text-sm text-brand">{saved ? 'Carteira salva.' : ''}</p>
        </div>
      </form>

      <section aria-labelledby="secondary" className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="secondary" className="font-bold">Carteira secundária</h2>
          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={sameAsMain} onChange={(e) => setSameAsMain(e.target.checked)} className="accent-[var(--brand)]" />
              Igual à carteira principal
            </label>
            <button type="button" className="font-bold text-brand outline-none focus-visible:ring-2 focus-visible:ring-ring">Adicionar</button>
          </div>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Você ainda não adicionou uma carteira secundária.</p>
      </section>
    </div>
  )
}
