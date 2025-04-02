import { publicProcedure } from '@server/trpc'
import { TRPCError } from '@trpc/server'

export const webhookProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.req) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Request object not found',
    })
  }
  if (ctx.req.method === 'POST') return next()
  throw new TRPCError({
    code: 'BAD_REQUEST',
    message: 'Endpoint accepts POST requests',
  })
})
