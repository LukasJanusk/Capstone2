import { router } from '../trpc'
import strava from './strava'
import topmediai from './topmediai'

export const appRouter = router({ strava, topmediai })

export type AppRouter = typeof appRouter
