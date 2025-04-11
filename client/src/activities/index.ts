import type { ActivityWithSong } from '@server/shared/trpc'
import { ref } from 'vue'
import { trpc } from '@/trpc'
import { parseErrorMessage, setError } from '@/errors'

const testActivity = {
  id: 1,
  type: 'ride' as const,
  title: 'Morning Ride',
  duration: 45,
  heartrate: 140,
  calories: 500,
  speedAverage: 28,
  distance: 20.5,
  cadence: 85,
  startTime: '2025-04-10T07:30:00Z',
}
const testSong = {
  id: 1,
  audioUrl:
    'https://files.topmediai.com/aimusic/api/6ad2dc9a-ee46-4d83-8d1f-682efe46c1f9-audio.mp3',
  title: 'Chill Vibes',
}
const fakeActivities = ref<ActivityWithSong[]>([
  { activity: testActivity, songs: [testSong, { testSong, title: 'Super Vibes' }] },
  {
    activity: { ...testActivity, type: 'static', id: 2 },
    songs: [testSong, { testSong, title: 'Super Vibes' }],
  },
  {
    activity: { ...testActivity, type: 'run', id: 3 },
    songs: [testSong, { testSong, title: 'Super Vibes' }],
  },
  {
    activity: { ...testActivity, type: 'run', id: 4 },
    songs: [testSong, { testSong, title: 'Super Vibes' }],
  },
  {
    activity: { ...testActivity, type: 'ride', id: 5 },
    songs: [testSong, { testSong, title: 'Super duper Vibes' }],
  },
  {
    activity: { ...testActivity, type: 'ride', id: 6 },
    songs: [testSong, { testSong, title: 'Super duper Vibes' }],
  },
  {
    activity: { ...testActivity, type: 'run', id: 7 },
    songs: [testSong, { testSong, title: 'Super duper Vibes' }],
  },
])
const activities = ref<ActivityWithSong[]>([])

export const userActivitiesWithSong = ref<ActivityWithSong[]>([])
export const getActivitiesWithSong = async () => {
  try {
    userActivitiesWithSong.value = fakeActivities.value
    // userActivitiesWithSong.value = await trpc.user.getUserActivitiesWithSongs.query()
  } catch (err) {
    setError(parseErrorMessage(err))
  }
}
