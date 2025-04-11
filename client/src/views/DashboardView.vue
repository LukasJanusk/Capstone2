<script lang="ts" setup>
import ErrorBox from '@/components/ErrorBox.vue'
import MainContainer from '@/components/MainContainer.vue'
import { onMounted } from 'vue'
import ActivityList from '@/components/ActivityList/ActivityList.vue'
import { errorMessage } from '../errors/index'
import TopBar from '@/components/TopBar.vue'
import { getActivitiesWithSong, userActivitiesWithSong } from '@/activities'

onMounted(async () => {
  await getActivitiesWithSong()
})
</script>

<template>
  <MainContainer>
    <TopBar :name="'My Activities'"></TopBar>
    <div class="main-box">
      <div><span v-if="userActivitiesWithSong.length < 1">No activities found</span></div>
      <ActivityList :activities-with-songs="userActivitiesWithSong"></ActivityList>
    </div>
    <button class="load-button" @click="getActivitiesWithSong">Load activities</button>
  </MainContainer>
  <ErrorBox :message="errorMessage"></ErrorBox>
</template>
<style lang="css" scoped>
.main-box {
  display: flex;
  margin-top: 100px;
  margin-left: 50px;
}
</style>
