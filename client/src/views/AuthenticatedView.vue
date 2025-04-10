<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { trpc } from '@/trpc'
import router from '@/router'
import { stravaAuthenticated } from '@/user'
import ErrorBox from '@/components/ErrorBox.vue'
import { errorMessage, setError, resetError, error, parseErrorMessage } from '../errors/index'
import MainContainer from '@/components/MainContainer.vue'

const authCode = ref('')
const accessGranter = ref(false)
const userName = ref('')
const returnToDashboard = () => {
  router.push({ name: 'Dashboard' })
}
const returnHome = () => {
  router.push({ name: 'Home' })
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
    setError(parseErrorMessage(err))
  }
})
</script>

<template>
  <MainContainer>
    <div v-if="accessGranter" class="main-container">
      <div>
        <h2>Hello, {{ userName }}</h2>
      </div>
      <div><h1>Strava access granted!</h1></div>
      <div><h2>Thank you for choosing us!</h2></div>
      <div @click="returnToDashboard()"><button>To Dashboard</button></div>
    </div>
  </MainContainer>
  <ErrorBox v-if="error" :message="errorMessage" @close="(resetError, returnHome)"> </ErrorBox>
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
