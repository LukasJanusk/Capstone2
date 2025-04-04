import express from 'express'
import {
  createExpressMiddleware,
  type CreateExpressContextOptions,
} from '@trpc/server/adapters/express'
import cors from 'cors'
import { renderTrpcPanel } from 'trpc-panel'
import config from './config'
import { type Context } from './trpc'
import { appRouter } from './controllers'
import { createStravaService } from './controllers/strava/services'
import createMusicGenerationService from './controllers/generator/model'
import type { Database } from './database'
import { logger } from './logger'

export default function createApp(db: Database) {
  const app = express()
  const stravaService = createStravaService(
    config.stravaClientId,
    config.stravaClientSecret
  )
  logger.info('Strava service created')
  const songGenerationService = createMusicGenerationService(
    config.topmediaiKey
  )
  logger.info('Music generation service created')
  app.use(cors())
  app.use(express.json())
  app.use('/api/trpc', (req, res, next) => {
    // eslint-disable-next-line no-console
    console.log(`Incoming request: ${req.method} ${req.originalUrl}`)
    next()
  })

  app.use('/api/health', (_, res) => {
    res.status(200).send('OK')
  })

  app.use(
    '/api/trpc',
    createExpressMiddleware({
      createContext: ({ req, res }: CreateExpressContextOptions): Context => ({
        db,
        req,
        res,
        stravaService,
        songGenerationService,
        logger,
      }),
      router: appRouter,
    })
  )
  if (config.env === 'development') {
    app.use('/api/v1/trpc-panel', (_, res) => {
      res.send(
        renderTrpcPanel(appRouter, {
          url: `http://localhost:${config.port}/api/trpc`,
        })
      )
    })
  }
  return app
}
