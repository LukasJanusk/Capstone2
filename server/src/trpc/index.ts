import { initTRPC } from '@trpc/server'
import type { Request, Response } from 'express'
import type { StravaService } from '@server/controllers/strava/services/strava'
import type { MusicGenerationService } from '@server/entities/services/MusicGenerationService'

export type Context = {
  req?: Request
  res?: Response
  stravaService: StravaService
  songGenerationService: MusicGenerationService
}
const t = initTRPC.context<Context>().create()
export const {
  createCallerFactory,
  mergeRouters,
  middleware,
  procedure: publicProcedure,
  router,
} = t
