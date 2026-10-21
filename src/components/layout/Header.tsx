import { Link } from '@tanstack/react-router'
import { Search, ShoppingCart } from 'lucide-react'
import { UserMenu } from '@/features/auth/components/UserMenu'
import { useCart } from '@/features/cart/cartStore'

const navLink =
  'border-b-2 border-transparent py-5 whitespace-nowrap outline-none hover:text-brand focus-visible:ring-2 focus-visible:ring-ring data-[status=active]:border-brand data-[status=active]:font-bold data-[status=active]:text-brand'

const soon = 'cursor-not-allowed py-5 opacity-50'

export function Header({ onSearch }: { onSearch: () => void }) {
  const { count } = useCart()

  return (
    <header className="hidden border-b border-border md:block">
      <div className="mx-auto grid h-16 max-w-[1200px] grid-cols-[1fr_auto_1fr] items-center px-6">
        <Link to="/" className="text-xs font-bold tracking-widest">
          KURIO
        </Link>

        <nav aria-label="Principal" className="flex gap-10 text-sm">
          <Link to="/" activeOptions={{ exact: true, includeHash: true }} className={navLink}>
            Início
          </Link>
          <Link to="/" hash="catalogo" activeOptions={{ exact: true, includeHash: true }} className={navLink}>
            Mercado
          </Link>
          <span aria-disabled="true" title="Em breve" className={soon}>Criadores</span>
          <span aria-disabled="true" title="Em breve" className={soon}>Aprenda</span>
        </nav>

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onSearch}
            aria-label="Buscar NFTs"
            className="rounded-md p-2 outline-none hover:text-brand focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Search className="size-5" />
          </button>
          <Link
            to="/cart"
            aria-label={`Carrinho, ${count} itens`}
            className="relative rounded-md p-2 outline-none hover:text-brand focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ShoppingCart className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-brand text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
