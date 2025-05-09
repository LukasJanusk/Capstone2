<script setup lang="ts">
import type { ActivityPublic, SongPublic } from '@server/shared/trpc'
import SongPlayer from './SongPlayer.vue'

const props = defineProps<{
  activity: ActivityPublic
  songs: SongPublic[]
}>()
const parseDuration = (duration: number): string => {
  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)
  let seconds = duration % 60
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
  else if (minutes > 0) return `${minutes}m ${seconds}s`
  else return `${seconds}s`
}
const parseValue = (key: string, value: string | number | undefined | null) => {
  if (!value) return 'No data'
  if (key === 'duration') {
    const parsed = parseDuration(value as number)
    return parsed
  } else if (key === 'heartrate') {
    return `${value} bpm`
  } else if (key === 'speedAverage') {
    return `${Math.round((value as number) * 3.6)} km/h`
  } else if (key === 'distance') return `${value} meters`
  else if (key === 'cadence') return `${value} rpm`
  else if (key === 'startTime') return `${new Date(value as string).toLocaleString()}`
  else return value
}
const parseKey = (key: string) => {
  if (key === 'speedAverage') return 'Average speed'
  else if (key === 'startTime') return 'Start time'
  else return key[0].toLocaleUpperCase() + key.slice(1)
}
</script>

<template>
  <div class="flex flex-1 flex-col md:flex-row">
    <UCard variant="subtle" class="w-full min-w-72 md:max-w-160">
      <template #header>
        <span class="h-8 text-xl font-bold">Activity</span>
      </template>
      <div class="flex flex-col justify-center align-middle text-xl lg:text-2xl">
        <div>
          <ul class="pb-2">
            <li class="text-start font-semibold" v-for="(value, key) in props.activity" :key="key">
              <span class="pr-1 font-extrabold">{{ parseKey(key) }}: </span>
              <span>{{ parseValue(key, value) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </UCard>
    <UCard v-if="songs.length > 0" variant="subtle" class="w-full min-w-72 md:max-w-160">
      <template #header>
        <span class="h-8 text-xl font-bold">Song</span>
      </template>
      <SongPlayer :songs="props.songs"></SongPlayer>
    </UCard>
    <UCard v-if="songs.length < 1" variant="subtle" class="w-full min-w-72 md:max-w-160">
      <template #header> <span class="h-8 text-xl font-bold">Song</span></template>
      <div
        class="min-w-72 min-h-72 flex flex-col align-middle justify-center text-lg text-error font-bold"
      >
        No songs found for the activity
      </div>
    </UCard>
  </div>
</template>

<style lang="css" scoped></style>
