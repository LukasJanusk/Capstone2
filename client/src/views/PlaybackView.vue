<script setup lang="ts">
import { ref } from 'vue'
import { trpc } from '@/trpc'

// URL to a song will be received from backend
const songUrl = ref(
  'https://files.topmediai.com/aimusic/api/6ad2dc9a-ee46-4d83-8d1f-682efe46c1f9-audio.mp3'
)
const waiting = ref(false)
const getSong = async () => {
  waiting.value = true
  const songs = await trpc.topmediai.fetchSongs.mutate({
    prompt:
      'Generate a high-energy electronic track with fast beats (140 BPM), deep bass, and uplifting synths. Inspired by progressive house, perfect for intense workouts and confident, extroverted individuals.',
    lyric:
      'Verse 1 🔥 Push it to the limit, feel the fire rise No looking back now, see it in my eyes Heartbeat racing, I’m breaking throughStronger than ever, nothing I can’t do Pre-Chorus ⚡ Run, jump, sweat, let it all igniteTurn up the volume, feel the bass take flight One more rep, one more mile Keep it going, make it worthwhile Chorus 🚀 Rise up, no stopping now Feel the power, shake the ground Lights flash, we own the night Keep on moving, reach new heights Drop (Instrumental Build-Up)',
    title: 'Boss rhymes',
  })
  songUrl.value = songs[0].audio_file
  waiting.value = false
}
</script>

<template>
  <div v-if="waiting">Waiting for song</div>
  <div v-if="songUrl.length > 1">
    <img src="" />
    <audio controls>
      <source :src="songUrl" type="audio/mp3" />
      Your browser does not support the audio element.
    </audio>
  </div>
  <div v-else><button @click="getSong">Get me a song!</button></div>
</template>

<style scoped></style>
