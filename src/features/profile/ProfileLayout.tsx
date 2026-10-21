import { Link, Outlet, useNavigate } from '@tanstack/react-router'
import { Download, Heart, LogOut, MapPin, ShoppingCart, TrendingUp, TriangleAlert, User } from 'lucide-react'

const item =
  'flex items-center gap-3 whitespace-nowrap border-l-4 border-transparent px-3 py-2.5 text-sm text-brand outline-none hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-ring data-[status=active]:border-brand data-[status=active]:bg-surface-2'
const soon = 'flex cursor-not-allowed items-center gap-3 whitespace-nowrap border-l-4 border-transparent px-3 py-2.5 text-sm text-brand opacity-50'

export function ProfileLayout() {
  const navigate = useNavigate()

  // TROQUE pela função de logout que o seu UserMenu já usa.
  function signOut() {
    void navigate({ to: '/' })
  }

  return (
    <div className="grid gap-8 md:grid-cols-[310px_1fr]">
      <aside aria-label="Menu do perfil" className="h-fit self-start bg-card">
        <h2 className="px-3 py-3 text-lg font-bold">Meu perfil</h2>
        <nav className="flex overflow-x-auto md:block">
          <Link to="/profile" activeOptions={{ exact: true }} className={item}>
            <User className="size-4" /> Dados do perfil
          </Link>
          <Link to="/profile/wallets" className={item}>
            <MapPin className="size-4" /> Carteiras
          </Link>
          <span aria-disabled="true" title="Em breve" className={soon}><ShoppingCart className="size-4" /> Atividade</span>
          <span aria-disabled="true" title="Em breve" className={soon}><Heart className="size-4" /> Lista de interesse</span>
          <span aria-disabled="true" title="Em breve" className={soon}><TrendingUp className="size-4" /> Ofertas</span>
          <span aria-disabled="true" title="Em breve" className={soon}><Download className="size-4" /> Arquivos baixados</span>
          <span aria-disabled="true" title="Em breve" className={soon}><TriangleAlert className="size-4" /> Suporte</span>
        </nav>
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center gap-3 border-t border-border px-3 py-3 text-sm font-bold text-brand outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <LogOut className="size-4" /> Sair
        </button>
      </aside>

      <section className="min-w-0">
        <Outlet />
      </section>
    </div>
  )
}
