<script lang="ts" setup>
import ErrorBox from '@/components/ErrorBox.vue'
import MainContainer from '@/components/MainContainer.vue'
import { onMounted, ref } from 'vue'
import ActivityList from '@/components/ActivityList/ActivityList.vue'
import { error, errorMessage, resetError } from '../errors/index'
import TopBar from '@/components/TopBar.vue'
import { getActivitiesWithSong, userActivitiesWithSong } from '@/activities'
import { requestSongData } from '../generator/index'
import { showHeader } from '@/user'

onMounted(async () => {
  await getActivitiesWithSong()
})
const show = ref<boolean>(false)
const popUpMessage = ref('No activities found')
const reload = async () => {
  await getActivitiesWithSong()
  if (userActivitiesWithSong.value.length > 0) {
    popUpMessage.value = 'Activities loaded'
    show.value = true
  } else if (!error.value) {
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
  } else if (!error.value) {
    popUpMessage.value = 'No new songs found'
    show.value = true
  }
}
const highlightSong = ref(false)
const highlightActivity = ref(false)
</script>

<template>
  <MainContainer>
    <div class="main-box">
      <TopBar :name="'My Activities'"></TopBar>
      <div>
        <Transition name="fade">
          <div class="info-box" v-if="show">
            <div>{{ popUpMessage }}</div>
            <button class="toggle-button" @click="show = !show">Close</button>
          </div>
        </Transition>
      </div>
      <div class="no-activity-message" v-if="userActivitiesWithSong.length < 1">
        <p>
          Once you have compelted your workout, activities with generated songs will be uploaded
          here. If activities do not appear after few minutes try pressing
          <span
            @mouseover="highlightActivity = true"
            @mouseleave="highlightActivity = false"
            class="indicator"
            >Load activities</span
          >
          button.
        </p>
        <p>
          Song generation takes another minute or two. If you have your activities loaded and don't
          see songs generated for those activities, try pressing
          <span
            @mouseover="highlightSong = true"
            @mouseleave="highlightSong = false"
            class="indicator"
            >Request songs</span
          >
          button.
        </p>
      </div>
      <ActivityList :activities-with-songs="userActivitiesWithSong"></ActivityList>
      <div :class="['button-container', { collapsed: !showHeader }]">
        <button
          :class="{ highlightActivity: highlightActivity }"
          class="load-button"
          @click="reload"
        >
          Load activities
        </button>
        <button
          :class="{ highlightSong: highlightSong }"
          class="request-button"
          @click="getMissingSongs"
        >
          Request Songs
        </button>
      </div>
    </div>
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
  color: rgb(255, 255, 255);
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  font-size: 30px;
  font-weight: 500;
  border-radius: 10px;
  border: 3px solid black;
  background-color: rgba(1, 60, 48, 1);
  box-shadow: 6px 6px 10px rgb(0, 0, 0, 0.3);
  position: fixed;
  padding: 15px;
}
.main-box {
  display: flex;
  margin-top: 100px;
  margin-left: 50px;
  margin-bottom: 70px;
}
.no-activity-message {
  max-width: 800px;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 15px;
}
.highlightSong {
  border: 1px solid blue;
}
.highlightActivity {
  border: 1px solid blue;
}
.indicator {
  font-weight: 1000;
}
.button-container {
  display: flex;
  z-index: 11;
  position: fixed;
  bottom: 10px;
  right: 150px;
  gap: 5px;
  transition: margin-left 0.6s ease;
}
.main-container.collapsed {
  margin-left: 10px;
  margin-right: 10px;
}
@media (prefers-color-scheme: light) {
  .no-activity-message {
    background-color: rgb(234, 233, 233);
    border: 2px solid rgba(152, 152, 152, 0.5);
  }
  .info-box {
    color: rgb(0, 0, 0);
    border: 3px solid rgb(0, 0, 0);
    background-color: rgb(59, 173, 151);
    box-shadow: 6px 6px 10px rgb(0, 0, 0, 0.3);
    position: fixed;
    padding: 15px;
  }
}
@media (max-width: 600px) {
  .main-box {
    margin-top: 50px;
    margin-left: 0px;
    flex-direction: column;
    flex-direction: column;
    align-items: center;
  }
  .button-container {
    width: 280px;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 10px;
    display: grid;
    grid-template-columns: 1fr, 1fr;
    margin-left: 120px;
  }
  .load-button {
    justify-self: flex-end;
    width: 130px;
    grid-row-start: 1;
    grid-column-start: 1;
  }
  .request-button {
    justify-self: flex-start;
    width: 130px;
    grid-row-start: 1;
    grid-column-start: 2;
  }
  .button-container.collapsed {
    margin-left: 0px;
  }
}
</style>
