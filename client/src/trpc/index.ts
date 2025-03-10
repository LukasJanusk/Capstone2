import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@server/shared/trpc'
import { getStoredAccessToken } from '@/utils/auth'

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc',
      headers: () => {
        const token = getStoredAccessToken(localStorage)
        if (token) return { authorization: `Bearer ${token}` }
        return {}
      },
    }),
  ],
})
