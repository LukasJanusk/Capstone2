<script lang="ts" setup>
import ErrorBox from '@/components/ErrorBox.vue'
import MainContainer from '@/components/MainContainer.vue'
import { onMounted, ref } from 'vue'
import ActivityList from '@/components/ActivityList/ActivityList.vue'
import { errorMessage, resetError } from '../errors/index'
import TopBar from '@/components/TopBar.vue'
import { getActivitiesWithSong, userActivitiesWithSong } from '@/activities'
import { requestSongData } from '../generator/index'

onMounted(async () => {
  await reload()
})
const show = ref<boolean>(true)
const reload = async () => {
  await getActivitiesWithSong()
  if (userActivitiesWithSong.value.length > 0) {
    popUpMessage.value = 'Activities loaded'
    show.value = true
  } else {
    popUpMessage.value = 'No Activities found'
    show.value = true
  }
}
const getMissingSongs = async () => {
  const reloadedActivitiesWithSongs = await requestSongData()
  if (reloadedActivitiesWithSongs.length > 0) {
    userActivitiesWithSong.value = reloadedActivitiesWithSongs
    popUpMessage.value = 'Activities with songs fetched'
    show.value = true
  } else {
    popUpMessage.value = 'No new Songs found'
    show.value = true
  }
}
const popUpMessage = ref('No activities found')
</script>

<template>
  <MainContainer>
    <TopBar :name="'My Activities'"></TopBar>
    <div class="main-box">
      <div>
        <Transition name="fade">
          <div class="info-box" v-if="show">
            <div>{{ popUpMessage }}</div>
            <button class="toggle-button" @click="show = !show">Close</button>
          </div>
        </Transition>
      </div>
      <ActivityList :activities-with-songs="userActivitiesWithSong"></ActivityList>
    </div>
    <button class="load-button" @click="reload">Load activities</button>
    <button class="request-button" @click="getMissingSongs">Request Songs</button>
  </MainContainer>

  <ErrorBox :message="errorMessage" @close="resetError"></ErrorBox>
</template>

<style lang="css" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.toggle-button {
  font-size: 15px;
}
p {
  font-size: 20px;
}
.info-box {
  top: 55px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  font-size: 30px;
  font-weight: 500;
  border-radius: 10px;
  padding: 15px;
  border: 3px solid black;
  background-color: rgba(1, 60, 48, 0.812);
  box-shadow: 6px 6px 10px rgb(0, 0, 0, 0.3);
  position: fixed;
  transform: translateX(-50%);
  padding: 15px;
}
.main-box {
  display: flex;
  margin-top: 100px;
  margin-left: 50px;
  margin-bottom: 70px;
}
.load-button {
  position: fixed;
  right: 10px;
  bottom: 10px;
  margin-top: 10px;
}
.request-button {
  position: fixed;
  right: 180px;
  bottom: 10px;
  margin-top: 10px;
}
</style>
