<script setup lang="ts">
import ActivityItem from './ActivityItem.vue'
import type { ActivityWithSong } from '@server/shared/trpc'

defineProps<{ activitiesWithSongs: ActivityWithSong[] }>()
</script>

<template>
  <div class="main-container">
    <ul>
      <li v-for="a in activitiesWithSongs" :key="a.activity.id">
        <ActivityItem :activity="a.activity" :songs="a.songs" />
      </li>
    </ul>
  </div>
</template>

<style lang="css" scoped></style>
