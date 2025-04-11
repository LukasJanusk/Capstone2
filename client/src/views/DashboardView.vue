<script lang="ts" setup>
import type { ActivityWithSong } from '@server/shared/trpc'
import ErrorBox from '@/components/ErrorBox.vue'
import MainContainer from '@/components/MainContainer.vue'
import { onMounted, ref } from 'vue'
import { trpc } from '@/trpc'
import ActivityList from '@/components/ActivityList/ActivityList.vue'
import { errorMessage, setError, resetError, error, parseErrorMessage } from '../errors/index'

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
const getAtctivitiesWithSongs = async () => {
  try {
    activities.value = fakeActivities.value
    // activities.value = await trpc.user.getUserActivitiesWithSongs.query()
  } catch (err) {
    setError(parseErrorMessage(err))
  }
}
onMounted(async () => {
  await getAtctivitiesWithSongs()
})
</script>

<template>
  <MainContainer>
    <div class="title-top"><h1>My Activities</h1></div>
    <hr />
    <div>
      <div><span v-if="activities.length < 1">No activities found</span></div>
      <ActivityList :activities-with-songs="activities"></ActivityList>

      <ErrorBox v-if="error" :message="errorMessage" @close="resetError"></ErrorBox>
    </div>
    <button @click="getAtctivitiesWithSongs">Load activities</button>
  </MainContainer>
</template>
<style lang="css" scoped>
.title-top {
}
</style>
