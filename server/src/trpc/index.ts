import { initTRPC } from '@trpc/server'
import type { Request, Response } from 'express'
import type { StravaService } from '@server/controllers/strava/services/strava'
import type { MusicGenerationService } from '@server/entities/services/MusicGenerationService'

import type { Repositories } from '@server/repositories'
import type { Database } from '@server/database'
import { type AuthUser } from '../entities/user'

export type Context = {
  db: Database
  req?: Request
  res?: Response
  repos?: Partial<Repositories>
  authUser?: AuthUser
  stravaService?: StravaService
  songGenerationService?: MusicGenerationService
}
export type ContextMinimal = Pick<Context, 'db'>

const t = initTRPC.context<Context>().create()
export const {
  createCallerFactory,
  mergeRouters,
  middleware,
  procedure: publicProcedure,
  router,
} = t
