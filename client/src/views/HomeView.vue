<script setup lang="ts">
import { authUserId, stravaAuthenticated } from '../user'
import router from '@/router'
import { trpc } from '../trpc/index'
import { onMounted, ref } from 'vue'
import { errorMessage } from '../errors/index'
import ErrorBox from '@/components/ErrorBox.vue'
import MainContainer from '@/components/MainContainer.vue'
import { authorizeUser } from '@/strava'
import TopBar from '@/components/TopBar.vue'

const clientId = ref('')
onMounted(async () => {
  clientId.value = await trpc.strava.getClientId.query()
  if (authUserId.value) {
    const response = await trpc.user.stravaAuthenticated.query()
    stravaAuthenticated.value = response.authenticated
  }
})
const returnHome = () => {
  router.push({ name: 'Home' })
}
</script>

<template>
  <MainContainer>
    <TopBar></TopBar>
    <div v-if="authUserId" id="authorized">
      <div><img id="logo" src="../assets/icon.png" /></div>
      <h2 v-if="!stravaAuthenticated" id="instruction">To start using our app click bellow</h2>
      <button v-if="!stravaAuthenticated" @click="authorizeUser(clientId)">Authorize Strava</button>
    </div>
  </MainContainer>
  <ErrorBox :message="errorMessage" @close="returnHome"></ErrorBox>
</template>

<style scoped>
.box {
  border-radius: 10px;
  border: 5px solid black;
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
@media (width <= 600px) {
  #logo {
    width: 300px;
  }
}
@media (prefers-color-scheme: light) {
  #logo {
    border: 5px solid rgba(5, 5, 5, 0.911);
  }
}
</style>
