<script setup lang="ts">
import type { SongPublic } from '@server/shared/trpc'
import { ref } from 'vue'

const props = defineProps<{ songs: SongPublic[] }>()

const songImageUrl = (song: SongPublic) => {
  return song.imageUrl || new URL('./assets/song_image_default.png', import.meta.url).href
}

const audioRefs = ref<HTMLAudioElement[]>([])

const setAudio = (el: HTMLAudioElement | null, idx: number) => {
  if (el) audioRefs.value[idx] = el
}
const resetAll = () => {
  audioRefs.value.forEach((a) => a?.pause())
}
</script>

<template>
  <div class="mb-6">
    <UCarousel :items="props.songs" v-slot="{ item, index }" dots @select="resetAll">
      <div class="relative w-full h-full">
        <img class="w-full h-full" :src="songImageUrl(item)" alt="Song album image" />
        <span
          class="absolute bottom-4 right-4 text-white text-base md:text-xl bg-black/50 px-2 py-1 rounded"
        >
          {{ item.title || 'Workout song' }}
        </span>
      </div>
      <audio class="w-full" :ref="(el) => setAudio(el as HTMLAudioElement, index)" controls>
        <source :src="item.audioUrl" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </UCarousel>
  </div>
</template>

<style lang="css" scoped></style>
