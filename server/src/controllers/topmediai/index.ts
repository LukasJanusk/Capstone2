import { router } from '@server/trpc'
import fetchSongs from './getSongs'

export default router({ fetchSongs })
