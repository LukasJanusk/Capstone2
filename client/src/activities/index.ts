import type { ActivityWithSong } from '@server/shared/trpc'
import { ref } from 'vue'
import { trpc } from '@/trpc'
import { parseErrorMessage, setError } from '@/errors'

const toast = useToast()
export const userActivitiesWithSong = ref<ActivityWithSong[]>([])

export const getActivitiesWithSong = async (options: { toast: boolean } = { toast: false }) => {
  try {
    const activities = await trpc.user.getUserActivitiesWithSongs.query()

    if (activities.length === 0) {
      toast.add({ title: 'Info', description: 'No activities found', color: 'info' })
      return
    }
    userActivitiesWithSong.value = activities
    if (!options.toast) {
      toast.add({
        title: 'Success',
        description: 'Activities loaded',
        color: 'success',
      })
    }
  } catch (err) {
    setError(parseErrorMessage(err))
  }
}
