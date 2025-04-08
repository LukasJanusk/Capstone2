<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ActivityList from '@/components/ActivityList/ActivityList.vue'
import { trpc } from '@/trpc'
import type { ActivityWithSong } from '@server/shared/trpc'
import ErrorBox from '@/components/ErrorBox.vue'
import { setError, resetError, error, errorMessage, parseErrorMessage } from '@/errors'

const songUrl = ref(
  'https://files.topmediai.com/aimusic/api/6ad2dc9a-ee46-4d83-8d1f-682efe46c1f9-audio.mp3'
)
const activities = ref<ActivityWithSong[]>([])
const getActivities = async () => {
  try {
    activities.value = await trpc.user.getUserActivitiesWithSongs.query()
  } catch (err) {
    setError(parseErrorMessage(err))
  }
}
onMounted(async () => {
  getActivities()
})
</script>

<template>
  <div>
    <ActivityList v-if="activities.length > 1" :activitiesWithSongs="activities"></ActivityList>
    <h2 v-else>No activities found</h2>
  </div>
  <button @click="getActivities">Load activities</button>
  <ErrorBox v-if="error" :message="errorMessage" @close="resetError"></ErrorBox>
</template>

<style scoped></style>
