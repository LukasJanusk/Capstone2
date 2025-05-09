<script lang="ts" setup>
import MainContainer from '@/components/MainContainer.vue'
import { onMounted } from 'vue'
import ActivityList from '@/components/ActivityList/ActivityList.vue'
import { getActivitiesWithSong, userActivitiesWithSong } from '@/activities'
import { requestSongData } from '../generator/index'

const toast = useToast()
onMounted(async () => {
  await getActivitiesWithSong({ toast: true })
})
const reload = async () => {
  await getActivitiesWithSong()
}
const getMissingSongs = async () => {
  const reloadedActivitiesWithSongs = await requestSongData()
  if (reloadedActivitiesWithSongs.length > 0) {
    userActivitiesWithSong.value = reloadedActivitiesWithSongs
    toast.add({
      title: 'Success',
      description: 'Activities with songs loaded',
      color: 'success',
    })
  } else {
    toast.add({
      title: 'Info',
      description: 'No songs found',
      color: 'info',
    })
  }
}
</script>

<template>
  <div>
    <MainContainer>
      <div class="justify-center align-middle mb-6">
        <div class="text-xl max-w-160" v-if="userActivitiesWithSong.length < 1">
          <p>
            Once you have completed your workout, activities with generated songs will be uploaded
            here. If activities do not appear after few minutes try pressing
            <span class="font-bold">Load activities</span>
            button.
          </p>
          <p>
            Song generation takes another minute or two. If you have your activities loaded and
            don't see songs generated for those activities, try pressing
            <span class="font-bold">Request songs</span>
            button.
          </p>
        </div>
        <ActivityList :activities-with-songs="userActivitiesWithSong"></ActivityList>
      </div>
    </MainContainer>
    <BottomBar>
      <div class="flex flex-2 gap-2 justify-center mt-4 md:justify-start">
        <UButton @click="reload" loading-auto> Load activities </UButton>
        <UButton @click="getMissingSongs" loading-auto> Request songs </UButton>
      </div>
    </BottomBar>
  </div>
</template>

<style lang="css" scoped></style>
