<script setup lang="ts">
import type { ActivityWithSong } from '@server/shared/trpc'
import { setError } from '@/errors'
import MainContainer from '@/components/MainContainer.vue'
import ActivityItem from '@/components/ActivityList/ActivityItem.vue'
import { getActivitiesWithSong, userActivitiesWithSong } from '@/activities'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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
    setError(`Activity ID: ${id} not found`)

    returnToDashboard()
  }
  return
})
</script>

<template>
  <div>
    <MainContainer>
      <ActivityItem
        v-if="activityWithSong"
        :activity="activityWithSong.activity"
        :songs="activityWithSong.songs"
      ></ActivityItem>
    </MainContainer>
  </div>
</template>

<style scoped></style>
