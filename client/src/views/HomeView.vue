<script setup lang="ts">
import { authUserId, stravaAuthenticated } from '../user'
import router from '@/router'
import { trpc } from '../trpc/index'
import { onMounted, ref } from 'vue'
import { errorMessage } from '../errors/index'
import ErrorBox from '@/components/ErrorBox.vue'
import MainContainer from '@/components/MainContainer.vue'
import { authorizeUser } from '@/strava'

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
    <div v-if="authUserId" id="authorized">
      <div><img id="logo" src="../assets/icon.png" /></div>
      <h2 v-if="!stravaAuthenticated" id="instruction">To start using our app click bellow</h2>
      <button v-if="!stravaAuthenticated" @click="authorizeUser(clientId)">Authorize Strava</button>
    </div>
  </MainContainer>
  <ErrorBox :message="errorMessage" @close="returnHome"></ErrorBox>
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
