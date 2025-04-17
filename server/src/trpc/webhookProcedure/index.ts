import { publicProcedure } from '@server/trpc'
import { TRPCError } from '@trpc/server'

export const webhookProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.req) {
    ctx.logger.error('No request object found')
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Request object not found',
    })
  }
  if (ctx.req.method === 'POST') return next()
  ctx.logger.error('Not POST webhook received')
  throw new TRPCError({
    code: 'BAD_REQUEST',
    message: 'Endpoint accepts POST requests',
  })
})
