<script setup lang="ts">
import type { ActivityWithSong } from '@server/shared/trpc'
import ErrorBox from '@/components/ErrorBox.vue'
import { setError, errorMessage } from '@/errors'
import MainContainer from '@/components/MainContainer.vue'
import ActivityItem from '@/components/ActivityList/ActivityItem.vue'
import { getActivitiesWithSong, userActivitiesWithSong } from '@/activities'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TopBar from '@/components/TopBar.vue'

const props = defineProps<{ activityId?: number }>()
const route = useRoute()
const returnToDashboard = () => {
  router.push({ name: 'Dashboard' })
}
const activityWithSong = ref<ActivityWithSong>()
const router = useRouter()
onMounted(async () => {
  if (userActivitiesWithSong.value.length < 1) {
    await getActivitiesWithSong()
  }
  const param = props.activityId ?? route.params.activityId
  const id = Array.isArray(param) ? parseInt(param[0], 10) : parseInt(String(param), 10)

  if (isNaN(id)) {
    setError('Invalid or missing activity ID')
    return
  }
  activityWithSong.value = userActivitiesWithSong.value.find((item) => item.activity.id === id)
  if (!activityWithSong.value) {
    setError(`Activity id: ${id} not found`)

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
