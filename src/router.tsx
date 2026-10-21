import {
  Link,
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router'
import { LoginPage } from '@/features/auth/LoginPage'
import { SignupPage } from '@/features/auth/SignupPage'
import { SessionExpiredDialog } from '@/features/auth/components/SessionExpiredDialog'
import { UserMenu } from '@/features/auth/components/UserMenu'
import { RedirectSearchSchema } from '@/features/auth/search'
import { sessionStore, useSession } from '@/features/auth/session'
import { CatalogPage } from '@/features/catalog/CatalogPage'
import { CatalogSearchSchema } from '@/features/catalog/search'
import { NftDetailPage } from '@/features/nft/NftDetailPage'

function RootLayout() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:rounded focus:bg-background focus:p-2"
      >
        Ir para o conteúdo
      </a>
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="text-lg font-bold">
            NFT Marketplace
          </Link>
          <UserMenu />
        </div>
      </header>
      <main id="main" className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
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

function ProfilePlaceholder() {
  const session = useSession()
  return (
    <div>
      <h1 className="text-2xl font-bold">Perfil</h1>
      <p className="mt-2">
        {session?.session.user.name} · {session?.session.user.email}
      </p>
      <p className="mt-2 text-muted-foreground">Edição de perfil e carteiras: próximos passos.</p>
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
  component: ProfilePlaceholder,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  nftRoute,
  loginRoute,
  signupRoute,
  authRoute.addChildren([profileRoute]),
])

export const router = createRouter({ routeTree, defaultPreload: 'intent' })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
