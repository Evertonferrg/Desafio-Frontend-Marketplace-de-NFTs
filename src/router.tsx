import {
  Link,
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  useRouter,
} from '@tanstack/react-router'
import { BottomNav } from '@/components/layout/BottomNav'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { LoginPage } from '@/features/auth/LoginPage'
import { SignupPage } from '@/features/auth/SignupPage'
import { SessionExpiredDialog } from '@/features/auth/components/SessionExpiredDialog'
import { RedirectSearchSchema } from '@/features/auth/search'
import { sessionStore } from '@/features/auth/session'
import { CartPage } from '@/features/cart/CartPage'
import { PaymentPage } from '@/features/cart/PaymentPage'
import { CatalogPage } from '@/features/catalog/CatalogPage'
import { CatalogSearchSchema } from '@/features/catalog/search'
import { NftDetailPage } from '@/features/nft/NftDetailPage'
import { ProfileLayout } from '@/features/profile/ProfileLayout'
import { ProfilePage } from '@/features/profile/ProfilePage'
import { WalletsPage } from '@/features/profile/WalletsPage'

function RootLayout() {
  const router = useRouter()

  // Lupa: leva ao catálogo e coloca o foco no campo de busca
  function focusSearch() {
    void router.navigate({ to: '/', hash: 'catalogo' }).then(() => {
      document.getElementById('q')?.focus()
    })
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:rounded focus:bg-background focus:p-2"
      >
        Ir para o conteúdo
      </a>

      <Header onSearch={focusSearch} />

      <main id="main" className="mx-auto max-w-[1200px] px-4 pb-24 pt-6 md:px-6 md:pb-6">
        <Outlet />
      </main>

      <Footer />
      <BottomNav />
      <SessionExpiredDialog />
    </>
  )
}

function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-bold">Página não encontrada</h1>
      <Link to="/" className="mt-4 inline-block underline">
        Voltar ao início
      </Link>
    </div>
  )
}

// Quem já está logado não precisa ver login/cadastro.
function guestOnly() {
  if (sessionStore.get()) throw redirect({ to: '/' })
}

const rootRoute = createRootRoute({ component: RootLayout, notFoundComponent: NotFound })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  validateSearch: (search) => CatalogSearchSchema.parse(search),
  component: CatalogPage,
})

const nftRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/nft/$id',
  component: NftDetailPage,
})

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
})

const paymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment',
  component: PaymentPage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  validateSearch: (search) => RedirectSearchSchema.parse(search),
  beforeLoad: guestOnly,
  component: LoginPage,
})

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  validateSearch: (search) => RedirectSearchSchema.parse(search),
  beforeLoad: guestOnly,
  component: SignupPage,
})

// Rotas privadas ficam sob este layout: sem sessão, vai para o login e volta depois.
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_auth',
  beforeLoad: ({ location }) => {
    if (!sessionStore.get()) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
  },
})

const profileRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/profile',
  component: ProfileLayout,
})

const profileIndexRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: '/',
  component: ProfilePage,
})

const walletsRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: 'wallets',
  component: WalletsPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  nftRoute,
  cartRoute,
  paymentRoute,
  loginRoute,
  signupRoute,
  authRoute.addChildren([profileRoute.addChildren([profileIndexRoute, walletsRoute])]),
])

export const router = createRouter({ routeTree, defaultPreload: 'intent' })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}