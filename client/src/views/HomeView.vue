<script setup lang="ts">
import { authUserId, onBoardComplete, stravaAuthenticated } from '../user'
import router from '@/router'
import { trpc } from '../trpc/index'
import { onMounted, ref } from 'vue'
import MainContainer from '@/components/MainContainer.vue'
import { authorizeUser } from '@/strava'
import Onboarding from '@/components/Onboarding.vue'

const clientId = ref('')

onMounted(async () => {
  clientId.value = await trpc.strava.getClientId.query()
  if (authUserId.value) {
    const response = await trpc.user.stravaAuthenticated.query()
    stravaAuthenticated.value = response.authenticated
  }
})
const goToSignup = () => {
  router.push({ name: 'Sign Up' })
}
</script>

<template>
  <MainContainer>
    <div v-if="!onBoardComplete">
      <h1>Welcome!</h1>
      <Onboarding @close="onBoardComplete = true"></Onboarding>
    </div>
    <div v-else>
      <div v-if="authUserId" id="authorized">
        <div><img id="logo" src="../assets/icon.png" /></div>
        <h2 v-if="!stravaAuthenticated" id="instruction">To start using our app click bellow</h2>
        <button v-if="!stravaAuthenticated" @click="authorizeUser(clientId)">
          Authorize Strava
        </button>
      </div>
      <div v-if="!authUserId" id="non-authorized">
        To start generating songs for your workouts
        <span id="sign-up-instruction" @click="goToSignup">Sign up</span> now.
      </div>
    </div>
  </MainContainer>
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
#non-authorized {
  font-size: large;
}
#sign-up-instruction {
  font-weight: 800;
}
#sign-up-instruction:hover {
  font-weight: 800;
  color: blue;
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
