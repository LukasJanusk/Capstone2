<script setup lang="ts">
import type { SongPublic } from '@server/shared/trpc'
import { nextTick, ref, watch } from 'vue'

const props = defineProps<{ songs: SongPublic[] }>()
const index = ref(0)

const songImageUrl = (song: SongPublic) => {
  return song.imageUrl || new URL('./assets/song_image_default.png', import.meta.url).href
}
const audioRef = ref<HTMLAudioElement | null>(null)

const onSlideChange = (newIndex: number) => {
  index.value = newIndex
}
watch(index, async () => {
  await nextTick()
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.currentTime = 0
    audioRef.value.load()
  }
})
</script>

<template>
  <div class="mb-6">
    <UCarousel :items="props.songs" dots :index="index" @update:modelValue="onSlideChange">
      <div class="relative w-full h-full">
        <img class="w-full h-full" :src="songImageUrl(props.songs[index])" alt="Song album image" />
        <span
          class="absolute bottom-4 right-4 text-white text-base md:text-xl bg-black/50 px-2 py-1 rounded"
        >
          {{ props.songs[0].title }}
        </span>
      </div>
      <audio class="w-full" ref="audioRef" controls>
        <source :src="props.songs[index].audioUrl" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </UCarousel>
  </div>
</template>

<style lang="css" scoped>
audio::-webkit-media-controls-panel {
  height: 50px !important;
}
audio::-webkit-media-controls-play-button,
audio::-webkit-media-controls-mute-button,
audio::-webkit-media-controls-volume-slider {
  width: 24px !important;
  height: 24px !important;
}
</style>
