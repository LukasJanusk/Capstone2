<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { trpc } from '@/trpc'
import router from '@/router'

const authCode = ref('')
const accessGranter = ref(false)
const userName = ref('')
const returnHome = () => {
  router.push({ name: 'Home' })
}
onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  if (code) {
    authCode.value = code
    const access = await trpc.strava.getAccess.mutate({ code })
    if (access) {
      const athlete = await trpc.strava.getAthlete.query()
      userName.value = athlete.stravaName
      accessGranter.value = true
    }
  }
})
</script>

<template>
  <div v-if="accessGranter" class="main-container">
    <div>
      <h2>Hello, {{ userName }}</h2>
    </div>
    <div><h1>Access granted!</h1></div>
    <div><h2>Thank you for choosing us!</h2></div>
    <div @click="returnHome()"><button>Return home</button></div>
  </div>
</template>

<style scoped>
.main-container {
  border-radius: 10px;
  padding: 15px;
  border: 3px solid black;
  background-color: rgba(1, 60, 48, 0.812);
  box-shadow: 6px 6px 10px rgb(0, 0, 0, 0.3);
}
</style>
