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

const authorizeUser = () => {
  const currentUrl = window.location.href
  const redirectUrl = currentUrl + 'authenticated'
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId.value}&response_type=code&redirect_uri=${redirectUrl}/&approval_prompt=force&scope=read,activity:read_all`
  window.location.href = authUrl
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
</style>
