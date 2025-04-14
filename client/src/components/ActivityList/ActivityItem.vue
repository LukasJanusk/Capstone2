<script setup lang="ts">
import type { ActivityPublic, SongPublic } from '@server/shared/trpc'
import SongPlayer from './SongPlayer.vue'

const props = defineProps<{
  activity: ActivityPublic
  songs: SongPublic[]
}>()
const parseValue = (key: string, value: string | number | undefined | null) => {
  if (key === 'duration') return `${value} seconds`
  else if (key === 'heartrate') return `${value} bpm`
  else if (key === 'speedAverage') return `${value} m/s`
  else if (key === 'distance') return `${value} meters`
  else if (key === 'cadence') return `${value} rpm`
  else if (key === 'startTime') return `${new Date(value as string).toLocaleString()}`
  else return value
}
const parseKey = (key: string) => {
  if (key === 'speedAverage') return 'average speed'
  else if (key === 'startTime') return 'start time'
  else return key
}
</script>

<template>
  <div class="main-container">
    <div class="activity-container">
      <h3>Activity</h3>
      <hr />
      <ul>
        <li class="activity-row" v-for="(value, key) in props.activity" :key="key">
          <span class="activity-row-key">{{ parseKey(key) }}</span>
          <span class="activity-row-value">: {{ parseValue(key, value) }}</span>
        </li>
      </ul>
    </div>
    <div class="songs-container">
      <h3>Songs</h3>
      <hr />
      <SongPlayer class="player" :songs="props.songs"></SongPlayer>
    </div>
  </div>
</template>

<style lang="css" scoped>
.main-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.activity-container {
  padding: 15px;
  text-justify: start;
}
.songs-container {
  padding: 15px;

  text-justify: start;
}
.activity-row {
  text-align: start;
  padding: 1px;
  font-size: 20px;
}
</style>
