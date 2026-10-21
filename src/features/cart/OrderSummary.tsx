import { useState, type ReactNode } from 'react'
import { eth, useCart } from './cartStore'

// Resumo de valores, usado no Carrinho e no Pagamento.
export function OrderSummary({ withPromo = false, children }: { withPromo?: boolean; children?: ReactNode }) {
  const { subtotal, fee, total } = useCart()
  const [code, setCode] = useState('')

  return (
    <div>
      {withPromo && (
        <div className="mb-4">
          <label htmlFor="promo" className="text-sm font-bold">Código promocional</label>
          <div className="mt-2 flex border border-brand">
            <input
              id="promo"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Digite o código promocional..."
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-xs outline-none placeholder:text-muted-foreground"
            />
            <button type="button" className="bg-primary px-5 font-bold text-primary-foreground">Aplicar</button>
          </div>
        </div>
      )}

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between"><dt>Subtotal</dt><dd>{eth(subtotal)}</dd></div>
        <div className="flex justify-between"><dt>Desconto do lançamento</dt><dd>(-) 00.00</dd></div>
        <div className="flex justify-between"><dt>Taxa de rede</dt><dd>{eth(fee, 3)}</dd></div>
        <p className="text-right text-xs text-brand">Taxa estimada</p>
        <div className="flex justify-between border-t border-border pt-3 font-bold">
          <dt>Total</dt>
          <dd className="text-brand">{eth(total, 3)}</dd>
        </div>
      </dl>
      {children}
    </div>
  )
}
