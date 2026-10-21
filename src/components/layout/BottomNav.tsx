import { Link } from '@tanstack/react-router'
import { Heart, Home, ShoppingCart, User } from 'lucide-react'
import { useCart } from '@/features/cart/cartStore'
import { useFocusedFlow } from './useFocusedFlow'

const item =
  'relative grid place-items-center rounded-md p-3 text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring data-[status=active]:text-brand'

// Só aparece no mobile; no desktop o menu fica no Header.
export function BottomNav() {
  const { count } = useCart()
  const focused = useFocusedFlow()
  if (focused) return null

  return (
    <nav
      aria-label="Navegação móvel"
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around rounded-t-3xl border-t border-border bg-card px-4 pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <Link to="/" activeOptions={{ exact: true }} aria-label="Início" className={item}>
        <Home className="size-6" />
      </Link>
      <span aria-disabled="true" title="Em breve" className={`${item} opacity-50`}>
        <Heart className="size-6" />
      </span>
      <Link to="/cart" aria-label={`Carrinho, ${count} itens`} className={item}>
        <ShoppingCart className="size-6" />
        {count > 0 && (
          <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-brand text-[10px] font-bold text-primary-foreground">
            {count}
          </span>
        )}
      </Link>
      <Link to="/profile" aria-label="Perfil" className={item}>
        <User className="size-6" />
      </Link>
    </nav>
  )
}
