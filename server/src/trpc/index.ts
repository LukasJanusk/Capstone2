import { initTRPC } from '@trpc/server'
import type { Request, Response } from 'express'

export type Context = {
  req?: Request
  res?: Response
}
const t = initTRPC.context<Context>().create()
export const {
  createCallerFactory,
  mergeRouters,
  middleware,
  procedure: publicProcedure,
  router,
} = t
