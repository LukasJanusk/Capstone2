import { router } from '@server/trpc'
import requestSong from './requestSong'
import storeGenerated from './storeGenerated'

export default router({ requestSong, storeGenerated })
