<script setup lang="ts">
import type { ActivityPublic, SongPublic } from '@server/shared/trpc';
import SongPlayer from './SongPlayer.vue';



const props = defineProps<{
  activity: ActivityPublic
  songs: SongPublic[]
}>()

</script>

<template>
  <div class="main-container">
    <div class="activity-container">
      <h3>Activity</h3>
      <hr>
      <ul>
        <li class="activity-row" v-for="(item, index) in Object.keys(props.activity)" :key="index">
          <span class="activity-row-key">{{ item }}</span>
          <span class="activity-row-value">: {{ (props.activity as Record<string, unknown>)[item] }}</span>
        </li>
      </ul>
    </div>
    <div class="songs-container">
      <h3>Songs</h3>
      <hr>
      <SongPlayer class="player" :songs="props.songs"></SongPlayer>
    </div>
  </div>
</template>

<style lang="css" scoped>
.main-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  /* grid-template-columns: 1fr auto;
  grid-template-rows: 1fr; */
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
