import { initTRPC } from '@trpc/server'
import type { Request, Response } from 'express'
import type { StravaService } from '@server/controllers/strava/services/strava'

export type Context = {
  req?: Request
  res?: Response
  stravaService: StravaService
}
const t = initTRPC.context<Context>().create()
export const {
  createCallerFactory,
  mergeRouters,
  middleware,
  procedure: publicProcedure,
  router,
} = t
