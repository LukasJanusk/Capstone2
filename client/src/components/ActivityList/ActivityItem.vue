<script setup lang="ts">
import type { ActivityFull, Song } from '@server/shared/trpc'

const props = defineProps<{
  activity: ActivityFull
  songs: Song[]
}>()
</script>

<template>
  <div class="main-container">
    <div class="activity-container">
      <ul>
        <li v-for="(item, index) in Object.keys(props.activity)" :key="index">
          <span>{{ item }}</span>
          <span>: {{ (props.activity as Record<string, unknown>)[item] }}</span>
        </li>
      </ul>
    </div>
    <div class="songs-container">
      <ul>
        <li v-for="song in props.songs" :key="song.id" class="song-item">
          <span> {{ song.title ? song.title : 'Workout song' }}</span>
          <img
            :src="song.imageUrl ? song.imageUrl : '../../assets/song_image_default.png'"
            alt="Song image"
          />
          <audio controls>
            <source :src="song.audioUrl" type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
