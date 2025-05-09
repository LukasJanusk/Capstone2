<script setup lang="ts">
import { authUserId, stravaAuthenticated } from '../user'
import { trpc } from '../trpc/index'
import { onMounted, ref } from 'vue'
import MainContainer from '@/components/MainContainer.vue'
import { authorizeUser } from '@/strava'
import router from '@/router'

const clientId = ref('')
const toDashboard = () => {
  router.push({ name: 'Dashboard' })
}
onMounted(async () => {
  clientId.value = await trpc.strava.getClientId.query()
  if (authUserId.value) {
    const response = await trpc.user.stravaAuthenticated.query()
    stravaAuthenticated.value = response.authenticated
  }
})
</script>

<template>
  <div>
    <MainContainer>
      <div v-if="authUserId">
        <div>
          <img
            class="max-w-[500px] w-full min-w-[300px] border-4 border-primary rounded-lg"
            src="../assets/icon.png"
          />
        </div>
        <div class="flex flex-col">
          <span v-if="!stravaAuthenticated" class="font-bold text-2xl p-2">
            To start using our app click bellow
          </span>
          <UButton
            icon="i-lucide-check"
            size="xl"
            class="self-center"
            v-if="!stravaAuthenticated"
            @click="authorizeUser(clientId)"
            loading-auto
          >
            Authorize Strava
          </UButton>
        </div>
      </div>
      <div v-if="!authUserId" class="font-bold text-2xl p-2">
        <span>To start generating songs for your workouts </span>
        <ULink as="button" to="signup">Sign up</ULink> now or
        <ULink as="button" to="signin">Sign in</ULink>.
      </div>
      <div v-if="authUserId && stravaAuthenticated" class="mt-4 flex flex-col">
        <span class="font-bold text-2xl p-2">To view your workouts click below</span>
        <UButton class="self-center" icon="i-lucide-arrow-right" size="xl" @click="toDashboard">
          To Dashboard
        </UButton>
      </div>
    </MainContainer>
  </div>
</template>

<style scoped></style>
