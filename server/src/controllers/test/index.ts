import { router } from '@server/trpc'
import createTokens from './createTokens'
import createActivitiesWithSongs from './createActivitiesWithSongs'

export default router({ createTokens, createActivitiesWithSongs })
