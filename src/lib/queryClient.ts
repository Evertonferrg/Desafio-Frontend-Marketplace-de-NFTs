import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/contracts'

const NO_RETRY = new Set(['VALIDATION', 'UNAUTHENTICATED', 'FORBIDDEN', 'NOT_FOUND', 'CONFLICT'])

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) =>
        !(error instanceof ApiError && NO_RETRY.has(error.code)) && failureCount < 1,
    },
  },
})