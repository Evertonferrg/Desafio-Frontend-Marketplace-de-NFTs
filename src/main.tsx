import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import '@fontsource-variable/roboto-mono'
import './index.css'
import { expiredStore } from '@/features/auth/expired'
import { sessionStore } from '@/features/auth/session'
import { configureHttp } from '@/lib/http'
import { queryClient } from '@/lib/queryClient'
import { router } from './router'
import '@fontsource-variable/roboto-mono'

// O cliente HTTP lê o token da sessão. Em 401 com usuário logado, a sessão local
// é descartada e o aviso "sessão expirou" é exibido.
configureHttp({
  getToken: () => sessionStore.getToken(),
  onUnauthenticated: () => {
    const hadSession = sessionStore.get() !== null
    sessionStore.clear()
    queryClient.removeQueries({ queryKey: ['user'] })
    if (hadSession) expiredStore.set(true)
  },
})

async function bootstrap() {
  if (import.meta.env.VITE_ENABLE_MOCKS === 'true') {
    try {
      const { worker } = await import('./mocks/browser')
      await worker.start({ onUnhandledRequest: 'bypass', quiet: true })
    } catch (err) {
      console.error('[mocks] falha ao iniciar o MSW:', err)
    }
  }
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
}

bootstrap()