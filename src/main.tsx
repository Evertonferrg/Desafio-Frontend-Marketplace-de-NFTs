import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import './index.css'
import { sessionStore } from '@/features/auth/session'
import { configureHttp } from '@/lib/http'
import { queryClient } from '@/lib/queryClient'
import { router } from './router'


configureHttp({
  getToken: () => sessionStore.getToken(),
  onUnauthenticated: () => {
    sessionStore.clear()
    queryClient.clear()
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