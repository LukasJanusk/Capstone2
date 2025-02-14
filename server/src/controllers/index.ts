import { router } from '../trpc'
import strava from './strava'

export const appRouter = router({ strava })

export type AppRouter = typeof appRouter
