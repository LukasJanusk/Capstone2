<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { trpc } from '@/trpc'
import router from '@/router'
import { stravaAuthenticated } from '@/user'

const authCode = ref('')
const accessGranter = ref(false)
const userName = ref('')
const returnHome = () => {
  resetError()
  router.push({ name: 'Home' })
}
const error = ref<boolean>(false)
const errorMessage = ref('')
const resetError = () => {
  errorMessage.value = ''
  error.value = false
}
onMounted(async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    if (code) {
      authCode.value = code
      const user = await trpc.strava.getAccess.mutate({ code })
      if (user) {
        userName.value = user.firstName
        accessGranter.value = true
        stravaAuthenticated.value = true
      }
    }
  } catch (err) {
    errorMessage.value = 'Something went wrong'
    error.value = true
  }
})
</script>

<template>
  <div v-if="accessGranter" class="main-container">
    <div>
      <h2>Hello, {{ userName }}</h2>
    </div>
    <div><h1>Strava access granted!</h1></div>
    <div><h2>Thank you for choosing us!</h2></div>
    <div @click="returnHome()"><button>Return home</button></div>
  </div>
  <div v-if="error" class="toast">
    <h2>{{ errorMessage }}</h2>
    <button @click="returnHome">Go back</button>
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
.toast {
  border-radius: 10px;
  padding: 15px;
  border: 3px solid black;
  background-color: rgba(60, 2, 1, 0.812);
  box-shadow: 6px 6px 10px rgb(0, 0, 0, 0.3);
}
</style>
