<script setup lang="ts">
import router from '@/router'
import type { ActivityWithSong } from '@server/shared/trpc'

defineProps<{ activitiesWithSongs: ActivityWithSong[] }>()
const transformTime = (dateString: string) => new Date(dateString).toLocaleDateString()

const goToPlayback = (id: number) => {
  router.push({ name: 'Playback', params: { activityId: id } })
}
const activityLink = (activityType: string) => {
  if (activityType === 'ride') return new URL('./assets/ride_default.png', import.meta.url).href
  else if (activityType === 'run') return new URL('./assets/run_default.png', import.meta.url).href
  else return new URL('./assets/static_default.png', import.meta.url).href
}
const activityAlt = (activityType: string) => {
  if (activityType === 'ride') return 'ride activity logo'
  else if (activityType === 'run') return 'run activity logo'
  else return 'static activity logo'
}
</script>

<template>
  <div class="flex flex-wrap gap-2 md:justify-start">
    <ActivityCard
      v-for="a in activitiesWithSongs"
      class="h-auto"
      @click="goToPlayback(a.activity.id)"
      :key="a.activity.id"
      :date="transformTime(a.activity.startTime)"
      :image="activityLink(a.activity.type)"
      :alt="activityAlt(a.activity.type)"
      :title="a.activity.title ? a.activity.title : 'Workout'"
    ></ActivityCard>
  </div>
</template>

<style lang="css" scoped></style>
