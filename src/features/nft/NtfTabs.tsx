import { useState } from 'react'

const TABS = ['Detalhes do NFT', 'Avaliações de colecionadores (19)'] as const

export function NftTabs({ name }: { name: string }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>(TABS[0])

  return (
    <section className="mt-12">
      <div role="tablist" aria-label="Informações do NFT" className="flex gap-6 overflow-x-auto border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`-mb-px whitespace-nowrap border-b-2 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring ${tab === t ? 'border-brand font-bold text-brand' : 'border-transparent'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === TABS[0] ? (
        <div role="tabpanel" className="mt-4 space-y-4 text-xs leading-relaxed text-muted-foreground md:text-sm">
          <p>{name} é uma obra digital finalizada à mão da coleção Kurio Editions. Cada atributo fica armazenado nos metadados do token e verificado na Ethereum. A obra explora identidade, movimento e luz em um mundo digital sem fronteiras.</p>
          <p>A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente de procedência registrada na rede.</p>
          <dl className="space-y-3">
            <div><dt className="font-bold text-foreground">Rede:</dt><dd>Cunhado na Ethereum com procedência imutável e metadados armazenados no IPFS.</dd></div>
            <div><dt className="font-bold text-foreground">Contrato:</dt><dd>0x7A42...19E8 • Contrato inteligente ERC-721 verificado.</dd></div>
            <div><dt className="font-bold text-foreground">Direitos autorais:</dt><dd>Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.</dd></div>
          </dl>
        </div>
      ) : (
        <p role="tabpanel" className="mt-4 text-sm text-muted-foreground">As avaliações dos colecionadores aparecem aqui.</p>
      )}
    </section>
  )
}
