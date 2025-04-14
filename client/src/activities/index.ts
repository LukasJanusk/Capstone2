import type { ActivityWithSong } from '@server/shared/trpc'
import { ref } from 'vue'
import { trpc } from '@/trpc'
import { parseErrorMessage, setError } from '@/errors'

export const userActivitiesWithSong = ref<ActivityWithSong[]>([])
export const getActivitiesWithSong = async () => {
  try {
    userActivitiesWithSong.value = await trpc.user.getUserActivitiesWithSongs.query()
  } catch (err) {
    setError(parseErrorMessage(err))
  }
}
