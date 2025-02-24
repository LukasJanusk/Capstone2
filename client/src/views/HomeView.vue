<script setup lang="ts">
import { ref } from 'vue'
import { StravaUser } from '../strava/index'
import { authUser } from '../user'
import HeaderMain from '@/components/HeaderMain.vue'
import router from '@/router'

const urlParams = new URLSearchParams(window.location.search)
const code = urlParams.get('code')
const stravaUser = new StravaUser()
stravaUser.accessToken = '252163ba4d9756934f7ae0e8287ca3fbdb0158b1'
const body = ref('')
const authenticated = ref('')
const firstName = ref('')
const lastName = ref('')
const id = ref('')
const clientId = 148802
const getBody = async () => {
  const data = await stravaUser.getAthlete()
  body.value = data
  console.log(data)
  firstName.value = data.firstname
  lastName.value = data.lastname
  id.value = data.id
}

const authorizeUser = () => {
  const redirectUri = 'http://localhost:5173/authenticated'
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}/&approval_prompt=force&scope=read,activity:read_all`
  window.location.href = authUrl
}
</script>

<template>
  <HeaderMain
    @signup="router.push({ name: 'SignUp' })"
    @signin="router.push({ name: 'SignIn' })"
  ></HeaderMain>
  <div v-if="authUser" id="authorized">
    <div><img id="logo" src="../assets/icon.png" /></div>
    <H2 id="instruction">To start using our app click bellow</H2>
    <button @click="authorizeUser()">Authorize</button>
    <div class="box" v-if="authenticated">
      <p>{{ authenticated }}</p>
      <button class="logo" @click="authenticated = ''">Close</button>
    </div>
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
