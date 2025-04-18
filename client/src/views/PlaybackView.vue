<script setup lang="ts">
import type { ActivityWithSong } from '@server/shared/trpc'
import ErrorBox from '@/components/ErrorBox.vue'
import { setError, errorMessage } from '@/errors'
import MainContainer from '@/components/MainContainer.vue'
import ActivityItem from '@/components/ActivityList/ActivityItem.vue'
import { userActivitiesWithSong } from '@/activities'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import TopBar from '@/components/TopBar.vue'

// const songUrl = ref(
//   'https://files.topmediai.com/aimusic/api/6ad2dc9a-ee46-4d83-8d1f-682efe46c1f9-audio.mp3'
// )
const props = defineProps<{ activityId: number }>()
const returnToDashboard = () => {
  router.push({ name: 'Dashboard' })
}
const activityWithSong = ref<ActivityWithSong>()
const router = useRouter()
onMounted(() => {
  const activityId = props.activityId
  console.log('Activity ID:', activityId)

  activityWithSong.value = userActivitiesWithSong.value.find(
    (item) => item.activity.id === activityId
  )
  if (!activityWithSong.value) {
    setError('Activity not found')

    return
  }
  return
})
</script>

<template>
  <MainContainer>
    <TopBar :name="'Playback'"></TopBar>
    <ActivityItem
      v-if="activityWithSong"
      :activity="activityWithSong.activity"
      :songs="activityWithSong.songs"
    ></ActivityItem>
  </MainContainer>
  <ErrorBox :message="errorMessage" @close="returnToDashboard"></ErrorBox>
</template>

<style scoped></style>
