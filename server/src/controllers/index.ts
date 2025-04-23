import { router } from '../trpc'
import strava from './strava'
import generator from './generator'
import user from './user'
import trait from './trait'
import test from './test'

export const appRouter = router({ strava, generator, user, trait, test })

export type AppRouter = typeof appRouter
