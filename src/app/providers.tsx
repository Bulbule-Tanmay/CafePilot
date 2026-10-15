import { useState, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary, OfflineBanner } from '../components/feedback/states'
import { AuthProvider } from './auth-context'

/** Query conventions: short staleTime, no retry storms, refetch on reconnect for realtime recovery. */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 15_000,
        retry: 1,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
      },
    },
  })
}

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(makeQueryClient)
  return (
    <ErrorBoundary>
      <QueryClientProvider client={client}>
        <AuthProvider>
          <OfflineBanner />
          {children}
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
