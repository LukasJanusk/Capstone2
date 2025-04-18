<script setup lang="ts">
import router from '@/router'
import type { ActivityWithSong } from '@server/shared/trpc'

defineProps<{ activitiesWithSongs: ActivityWithSong[] }>()
const transformTime = (dateString: string) => new Date(dateString).toLocaleDateString()

const goToPlayback = (id: number) => {
  router.push({ name: 'Playback', params: { activityId: id } })
}
</script>

<template>
  <div class="main-container">
    <div class="activity-box" v-for="a in activitiesWithSongs" :key="a.activity.id">
      <div class="image-container">
        <h2 class="title-text">{{ a.activity.title }}</h2>
        <span class="date-text">{{ transformTime(a.activity.startTime) }} </span>
        <img
          class="activity-image"
          v-if="a.activity.type === 'ride'"
          src="./assets/ride_default.png"
          alt="ride_logo"
          @click="goToPlayback(a.activity.id)"
        />
        <img
          class="activity-image"
          v-if="a.activity.type === 'run'"
          src="./assets/run_default.png"
          alt="run_logo"
          @click="goToPlayback(a.activity.id)"
        />
        <img
          class="activity-image"
          v-if="a.activity.type === 'static'"
          src="./assets/static_default.png"
          alt="static_logo"
          @click="goToPlayback(a.activity.id)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.main-container {
  display: flex;
  flex-wrap: wrap;
}
.activity-box {
  background-color: rgba(1, 1, 1, 0.4);
  padding: 5px;
  padding-bottom: 0px;
  width: 300px;
  aspect-ratio: 1 / 1;
  min-width: 250px;
  border: 1px solid rgba(0, 0, 0, 0.185);
}
.activity-box:hover {
  background-color: rgba(251, 251, 251, 0.9);
  border: 1px solid black;
}
.activity-box:focus {
  background-color: rgba(251, 251, 251, 0.9);
  border: 1px solid black;
}
.image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
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
  width: 100%;
  aspect-ratio: 1 / 1;
}
@media (width <= 600px) {
  .main-container {
    min-width: 250px;
  }
  .activity-box {
    width: 100%;
  }
  .image-container {
    position: relative;
    width: 100%;
  }
}
</style>
