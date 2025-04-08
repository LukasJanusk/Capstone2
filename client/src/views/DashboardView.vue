<script lang="ts" setup>
import HeaderMain from '@/components/HeaderMain.vue'
import type { ActivityWithSong } from '@server/shared/trpc'
import ErrorBox from '@/components/ErrorBox.vue'
import { logout } from '../user'
import router from '@/router'
import { onMounted, ref } from 'vue'
import { trpc } from '@/trpc'
import { errorMessage, setError, resetError, error, parseErrorMessage } from '../errors/index'

const activities = ref<ActivityWithSong[]>([])
const getAtctivitiesWithSongs = async () => {
  try {
    activities.value = await trpc.user.getUserActivitiesWithSongs.query()
  } catch (err) {
    setError(parseErrorMessage(err))
  }
}
onMounted(async () => {
  await getAtctivitiesWithSongs()
})
</script>

<template>
  <div>
    <HeaderMain
      @signup="router.push({ name: 'SignUp' })"
      @signin="router.push({ name: 'SignIn' })"
      @signout="(logout(), router.push({ name: 'SignIn' }))"
    ></HeaderMain>
    <div><span v-if="activities.length < 1">No activities found</span></div>
    <button @click="getAtctivitiesWithSongs">Load activities</button>
    <ErrorBox v-if="error" :message="errorMessage" @close="resetError"></ErrorBox>
  </div>
</template>
<style lang="css" scoped></style>
