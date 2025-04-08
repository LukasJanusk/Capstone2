import { initTRPC } from '@trpc/server'
import type { Request, Response } from 'express'
import type { StravaService } from '@server/controllers/strava/services'
import type { Repositories } from '@server/repositories'
import type { Database } from '@server/database'
import type { SongGenerationService } from '@server/controllers/generator/model'
import { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import type { Logger } from '../logger'
import type { AuthUser } from '../entities/user'

export type Context = {
  db: Database
  req?: Request
  res?: Response
  authUser?: AuthUser
  repos?: Partial<Repositories>
  stravaService: StravaService
  songGenerationService: SongGenerationService
  logger: Logger
}
export type ContextMinimal = Pick<Context, 'db'>

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      message:
        error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
          ? error.cause.errors[0]?.message || 'Invalid input'
          : shape.message,
    }
  },
})
export const {
  createCallerFactory,
  mergeRouters,
  middleware,
  procedure: publicProcedure,
  router,
} = t
