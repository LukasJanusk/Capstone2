<script setup lang="ts">
import type { ActivityWithSong } from '@server/shared/trpc'

defineProps<{ activitiesWithSongs: ActivityWithSong[] }>()
</script>

<template>
  <div class="main-container">
    <div class="activity-box" v-for="a in activitiesWithSongs" :key="a.activity.id">
      <div class="image-container">
        <h2 class="title-text">{{ a.activity.title }}</h2>
        <span class="date-text">{{ a.activity.startTime }} </span>
        <img
          class="activity-image"
          v-if="a.activity.type === 'ride'"
          src="./assets/ride_default.png"
          alt="ride_logo"
        />
        <img
          class="activity-image"
          v-if="a.activity.type === 'run'"
          src="./assets/run_default.png"
          alt="run_logo"
        />
        <img
          class="activity-image"
          v-if="a.activity.type === 'static'"
          src="./assets/static_default.png"
          alt="static_logo"
        />
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.main-container {
  display: flex;
  flex-wrap: wrap;
  min-width: 800px;
  height: 600px;
  overflow-y: auto;
}
.activity-box {
  margin: 1px;
  background-color: rgba(1, 1, 1, 0.4);
  padding: 3px;
  width: 300px;
  height: 300px;
  border: 1px solid rgba(0, 0, 0, 0.185);
}
.activity-box:hover {
  background-color: rgba(251, 251, 251, 0.9);
  border: 1px solid black;
}
.image-container {
  position: relative;
}
.title-text {
  position: absolute;
  bottom: 1px;
  color: white;
  font-weight: bold;
  text-shadow: 0 0 5px black;
  z-index: 2;
  left: 50%;
  transform: translate(-50%, -50%);
}
.date-text {
  position: absolute;
  bottom: 1px;
  color: white;
  font-weight: bold;
  text-shadow: 0 0 5px black;
  z-index: 2;
  left: 50%;
  transform: translate(-50%, -50%);
}
.activity-image {
  width: 300px;
}
@media (width <= 800px) {
  .main-container {
    min-width: 360px;
  }
}
</style>
