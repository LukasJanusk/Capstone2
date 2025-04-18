<script setup lang="ts">
import type { SongPublic } from '@server/shared/trpc'
import { ref, watch } from 'vue'

const props = defineProps<{ songs: SongPublic[] }>()
const index = ref(0)
watch(index, (newIndex) => {
  if (newIndex >= props.songs.length) index.value = 0
  if (newIndex < 0) index.value = props.songs.length - 1
})
const songImageUrl = (song: SongPublic) => {
  return song.imageUrl || new URL('./assets/song_image_default.png', import.meta.url).href
}
const audioRef = ref<HTMLAudioElement | null>(null)

const playNext = () => {
  index.value = (index.value + 1) % props.songs.length
  resetAudio()
}
const playPrev = () => {
  index.value = (index.value - 1 + props.songs.length) % props.songs.length
  resetAudio()
}
const resetAudio = () => {
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.currentTime = 0
  }
}
</script>

<template>
  <div class="main-container-inner">
    <div class="song-item">
      <div class="image-container">
        <h2 class="song-title">{{ songs[index].title ? songs[index].title : 'Workout song' }}</h2>
        <img class="song-image" :src="songImageUrl(props.songs[index])" alt="Song image" />
        <img
          @click="playPrev"
          class="nav-item left-arrow"
          id="left-arrow"
          src="./assets/left.png"
          alt="left-arrow"
        />
        <img
          @click="playNext"
          class="nav-item right-arrow"
          id="right-arrow"
          src="./assets/right.png"
          alt="right-arrow"
        />
      </div>
      <audio ref="audioRef" controls>
        <source :src="songs[index].audioUrl" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  </div>
</template>

<style lang="css" scoped>
.main-container-inner {
  width: 100%;
}
.song-item {
  position: relative;
  margin: 5px;
}
.image-container {
  width: 400px;
  background-color: black;
}
.song-title {
  color: black;
  z-index: 10;
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translatex(-50%);
  color: white;

  /* WebKit-based outline */
  -webkit-text-stroke: 1px black;
  text-shadow:
    -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000;
}
.nav-item {
  height: 50px;
  border-radius: 8px;
  background: rgba(190, 192, 192, 0.6);
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  cursor: pointer;
  z-index: 10;
}
#left-arrow {
  left: 10px;
}

#right-arrow {
  right: 10px;
}
.nav-item:hover {
  background: rgba(190, 192, 192, 0.9);
}
.nav-item:focus {
  background: rgba(190, 192, 192, 0.9);
}
.song-image {
  width: 100%;
  height: 100%;
}
audio {
  width: 100%;
  background-color: black;
}
@media (width <=600px) {
  .image-container {
    width: 100%;
    min-width: 200px;
  }
  .song-item {
    margin: 0px;
  }

  audio {
    height: 50px; /* container height */
  }

  /* WebKit-specific tweaks */
  audio::-webkit-media-controls-panel {
    height: 50px !important;
  }
  audio::-webkit-media-controls-play-button,
  audio::-webkit-media-controls-mute-button,
  audio::-webkit-media-controls-volume-slider {
    width: 24px !important;
    height: 24px !important;
  }
}
</style>
