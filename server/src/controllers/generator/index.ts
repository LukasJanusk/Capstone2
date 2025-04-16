import { router } from '@server/trpc'
import requestSong from './requestSong'
import storeGenerated from './storeGenerated'
import getSongByTaskId from './getSongByTaskId'

export default router({ requestSong, storeGenerated, getSongByTaskId })
