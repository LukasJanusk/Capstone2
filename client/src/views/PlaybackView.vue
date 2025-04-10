<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { trpc } from '@/trpc'
import type { ActivityWithSong } from '@server/shared/trpc'
import ErrorBox from '@/components/ErrorBox.vue'
import { setError, resetError, error, errorMessage, parseErrorMessage } from '@/errors'
import MainContainer from '@/components/MainContainer.vue'
import ActivityItem from '@/components/ActivityList/ActivityItem.vue'

const songUrl = ref(
  'https://files.topmediai.com/aimusic/api/6ad2dc9a-ee46-4d83-8d1f-682efe46c1f9-audio.mp3'
)
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
])
const activities = ref<ActivityWithSong[]>([])
const getActivities = async () => {
  try {
    activities.value = fakeActivities.value
    // activities.value = await trpc.user.getUserActivitiesWithSongs.query()
  } catch (err) {
    setError(parseErrorMessage(err))
  }
}
onMounted(async () => {
  getActivities()
})
</script>

<template>
  <MainContainer>
    <ActivityItem
      v-if="activities.length > 0"
      :activity="activities[0].activity"
      :songs="activities[0].songs"
    ></ActivityItem>
    <button @click="getActivities">Load activities</button>
  </MainContainer>
  <ErrorBox v-if="error" :message="errorMessage" @close="resetError"></ErrorBox>
</template>

<style scoped></style>
