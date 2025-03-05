import { router } from '../trpc'
import strava from './strava'
import topmediai from './topmediai'
import user from './user'

export const appRouter = router({ strava, topmediai, user })

export type AppRouter = typeof appRouter
