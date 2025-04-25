import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@server/shared/trpc'
import { getStoredAccessToken } from '@/utils/auth'
import { apiBase } from '@/config'
import superjson from 'superjson'

export const trpc: ReturnType<typeof createTRPCProxyClient<AppRouter>> =
  createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: apiBase,
        headers: () => {
          const token = getStoredAccessToken(localStorage)
          if (token) return { authorization: `Bearer ${token}` }
          return {}
        },
      }),
    ],
    transformer: superjson,
  })
