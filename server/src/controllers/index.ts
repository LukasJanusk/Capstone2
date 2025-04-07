import { router } from '../trpc'
import strava from './strava'
import generator from './generator'
import user from './user'
import trait from './trait'

export const appRouter = router({ strava, generator, user, trait })

export type AppRouter = typeof appRouter
