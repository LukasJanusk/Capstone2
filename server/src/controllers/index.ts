import { router } from '../trpc'
import strava from './strava'
import topmediai from './topmediai'
import user from './user'
import trait from './trait'

export const appRouter = router({ strava, topmediai, user, trait })

export type AppRouter = typeof appRouter
