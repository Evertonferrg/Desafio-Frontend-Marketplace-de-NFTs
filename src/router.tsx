import {
  Link,
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { CatalogPage } from '@/features/catalog/CatalogPage'
import { CatalogSearchSchema } from '@/features/catalog/search'

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
        </div>
      </header>
      <main id="main" className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
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

function NftPlaceholder() {
  const { id } = nftRoute.useParams()
  return (
    <div>
      <Link to="/" className="underline">
        ← Voltar
      </Link>
      <h1 className="mt-4 text-2xl font-bold">NFT {id}</h1>
      <p className="mt-2 text-muted-foreground">Tela de detalhe: próximo passo.</p>
    </div>
  )
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
  component: NftPlaceholder,
})

const routeTree = rootRoute.addChildren([indexRoute, nftRoute])

export const router = createRouter({ routeTree, defaultPreload: 'intent' })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
