<script setup lang="ts">
import { authUserId, logout, stravaAuthenticated } from '../user'
import HeaderMain from '@/components/HeaderMain.vue'
import router from '@/router'
import { trpc } from '../trpc/index'
import { onMounted, ref } from 'vue'

const clientId = ref('')
onMounted(async () => {
  clientId.value = await trpc.strava.getClientId.query()
})
const errorMessage = ref('')
const error = ref<boolean>(false)
const authorizeUser = async () => {
  try {
    const currentUrl = window.location.href
    const redirectUrl = currentUrl + 'authenticated'
    if (!clientId.value) {
      error.value = true
      errorMessage.value = 'Unable to reach server, please try again later'
      clientId.value = await trpc.strava.getClientId.query()
      return
    }
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId.value}&response_type=code&redirect_uri=${redirectUrl}/&approval_prompt=force&scope=read,activity:read_all`
    window.location.href = authUrl
  } catch (err) {
    errorMessage.value = 'Something went wrong'
    error.value = true
  }
}
const resetError = () => {
  errorMessage.value = ''
  error.value = false
}
</script>

<template>
  <HeaderMain
    @signup="router.push({ name: 'SignUp' })"
    @signin="router.push({ name: 'SignIn' })"
    @signout="(logout(), router.push({ name: 'SignIn' }))"
  ></HeaderMain>
  <div v-if="authUserId" id="authorized">
    <div><img id="logo" src="../assets/icon.png" /></div>
    <h2 v-if="!stravaAuthenticated" id="instruction">To start using our app click bellow</h2>
    <button v-if="!stravaAuthenticated" @click="authorizeUser()">Authorize Strava</button>
  </div>
  <div @click="resetError" class="toast" v-if="error">
    <h2>{{ errorMessage }}</h2>
    <button>Close</button>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.box {
  border-radius: 10px;
  border: 1px solid black;
  padding: 10px;
}
#logo {
  width: 300px;
  border-radius: 20px;
  border: 5px solid black;
  margin-bottom: 10px;
}
#instruction {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
.toast {
  border-radius: 10px;
  padding: 15px;
  border: 3px solid black;
  background-color: rgba(60, 2, 1, 1);
  box-shadow: 6px 6px 10px rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}
</style>
