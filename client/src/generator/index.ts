import { trpc } from '@/trpc'
import { setError, parseErrorMessage } from '@/errors'

export const requestSongData = async () => {
  try {
    const activitiesWithSongs = await trpc.generator.getSongByTaskId.mutate()
    return activitiesWithSongs
  } catch (err) {
    setError(parseErrorMessage(err))
    return []
  }
}
