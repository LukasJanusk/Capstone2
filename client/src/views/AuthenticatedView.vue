<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { trpc } from '@/trpc'
import router from '@/router'
import { stravaAuthenticated } from '@/user'
import { setError, parseErrorMessage } from '../errors/index'
import MainContainer from '@/components/MainContainer.vue'
import { useRoute } from 'vue-router'

const toast = useToast()
const accessGranter = ref(false)
const userName = ref('')
const route = useRoute()
const toDashboard = () => {
  router.push({ name: 'Dashboard' })
}
const returnHome = () => {
  router.push({ name: 'Home' })
}
onMounted(async () => {
  try {
    const code = route.query.code as string
    if (code) {
      const user = await trpc.strava.getAccess.mutate({ code })
      if (user) {
        userName.value = user.firstName
        accessGranter.value = true
        stravaAuthenticated.value = true
      }
      toast.add({
        title: 'Success',
        description: `Strava access granted. Thank you for choosing us, ${userName.value}.`,
        color: 'success',
      })
      toDashboard()
    } else {
      throw new Error('Something went wrong getting Strava authorization')
    }
  } catch (err) {
    setError(parseErrorMessage(err))
    returnHome()
  }
})
</script>

<template>
  <div>
    <MainContainer>
      <div class="flex flex-col items-center justify-center h-screen text-center">
        <div class="font-bold mb-2 text-2xl">Loading</div>
        <UProgress v-if="!accessGranter" class="max-w-[300px]" size="xl" animation="swing" />
      </div>
    </MainContainer>
  </div>
</template>

<style scoped></style>
