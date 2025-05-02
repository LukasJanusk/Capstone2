<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { trpc } from '@/trpc'
import router from '@/router'
import { stravaAuthenticated } from '@/user'
import ErrorBox from '@/components/ErrorBox.vue'
import { errorMessage, setError, parseErrorMessage } from '../errors/index'
import MainContainer from '@/components/MainContainer.vue'

const accessGranter = ref(false)
const userName = ref('')

const toDashboard = () => {
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
      const user = await trpc.strava.getAccess.mutate({ code })
      if (user) {
        userName.value = user.firstName
        accessGranter.value = true
        stravaAuthenticated.value = true
      }
    } else {
      throw new Error('Something went wrong getting Strava authorization')
    }
  } catch (err) {
    setError(parseErrorMessage(err))
  }
})
</script>

<template>
  <MainContainer>
    <div v-if="accessGranter" class="message-container">
      <div>
        <h2>Hello, {{ userName }}</h2>
      </div>
      <div><h1>Strava access granted!</h1></div>
      <div><h2>Thank you for choosing us!</h2></div>
      <div @click="toDashboard()"><button>To dashboard</button></div>
    </div>
  </MainContainer>
  <ErrorBox :message="errorMessage" @close="returnHome"> </ErrorBox>
</template>

<style scoped>
.message-container {
  border-radius: 10px;
  padding: 15px;
  border: 3px solid black;
  background-color: rgba(1, 60, 48, 1);
  box-shadow: 6px 6px 10px rgb(0, 0, 0, 0.3);
}
</style>
