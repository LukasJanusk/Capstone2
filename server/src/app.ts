import express from 'express'
import {
  createExpressMiddleware,
  type CreateExpressContextOptions,
} from '@trpc/server/adapters/express'
import cors from 'cors'
import config from './config'
import { type Context } from './trpc'
import { appRouter } from './controllers'
import { createStravaService } from './controllers/strava/services/strava'
import createMusicGenerationService from './controllers/generator/model'

export default function createApp() {
  const app = express()
  const stravaService = createStravaService(
    config.stravaClientId,
    config.stravaClientSecret
  )
  const topmediaaiService = createMusicGenerationService(config.topmediaiKey)
  app.use(cors())
  app.use(express.json())

  app.use('/api/trpc', (req, res, next) => {
    // eslint-disable-next-line no-console
    console.log(`Incoming request: ${req.method} ${req.originalUrl}`)
    next()
  })

  app.use(
    '/api/trpc',
    createExpressMiddleware({
      createContext: ({ req, res }: CreateExpressContextOptions): Context => ({
        req,
        res,
        stravaService,
        songGenerationService: topmediaaiService,
      }),
      router: appRouter,
    })
  )
  return app
}
