<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { trpc } from '@/trpc'
import router from '@/router'
import { StravaUser } from '@/strava'

const user = ref(new StravaUser())
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
      user.value.accessToken = access.accessToken
      const userDetails = await user.value.getAthlete()
      if (userDetails.firstname) {
        console.log(userDetails)
        userName.value = userDetails.firstname
        accessGranter.value = true
      }
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
