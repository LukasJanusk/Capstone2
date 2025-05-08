<script lang="ts" setup>
import MainContainer from '@/components/MainContainer.vue'
import { onMounted } from 'vue'
import ActivityList from '@/components/ActivityList/ActivityList.vue'
import { getActivitiesWithSong, userActivitiesWithSong } from '@/activities'
import { requestSongData } from '../generator/index'

const toast = useToast()
onMounted(async () => {
  await getActivitiesWithSong()
  userActivitiesWithSong.value = [
    {
      activity: {
        id: 123,
        type: 'ride',
        title: 'Run baby run',
        duration: 10000,
        heartrate: 200,
        startTime: '2018-02-20T18:02:13Z',
        speedAverage: 9.4,
        cadence: 24,
        distance: 2000,
        calories: 233,
      },
      songs: [
        {
          id: 123,
          audioUrl:
            'https://apiboxfiles.erweima.ai/YmY2YWVlZjYtY2RhYy00MzM0LWIwZjUtNjQ3Zjg4YjUxNTIy.mp3',
          imageUrl:
            'https://apiboxfiles.erweima.ai/YmY2YWVlZjYtY2RhYy00MzM0LWIwZjUtNjQ3Zjg4YjUxNTIy.jpeg',
          title: 'Fire Song',
        },
        {
          id: 123,
          audioUrl:
            'https://apiboxfiles.erweima.ai/YmY2YWVlZjYtY2RhYy00MzM0LWIwZjUtNjQ3Zjg4YjUxNTIy.mp3',
          imageUrl:
            'https://apiboxfiles.erweima.ai/YmY2YWVlZjYtY2RhYy00MzM0LWIwZjUtNjQ3Zjg4YjUxNTIy.jpeg',
          title: 'Fire Song',
        },
      ],
    },
    {
      activity: {
        id: 123,
        type: 'ride',
        title: 'Run baby run',
        duration: 100,
        heartrate: 200,
        startTime: '2018-02-20T18:02:13Z',
        speedAverage: 4.4,
        cadence: 24,
        distance: 2000,
        calories: 233,
      },
      songs: [
        {
          id: 123,
          audioUrl:
            'https://apiboxfiles.erweima.ai/YmY2YWVlZjYtY2RhYy00MzM0LWIwZjUtNjQ3Zjg4YjUxNTIy.mp3',
          imageUrl:
            'https://apiboxfiles.erweima.ai/YmY2YWVlZjYtY2RhYy00MzM0LWIwZjUtNjQ3Zjg4YjUxNTIy.jpeg',
          title: 'Fire Song',
        },
      ],
    },

    {
      activity: {
        id: 123,
        type: 'ride',
        title: 'Run baby run',
        duration: 100,
        heartrate: 200,
        startTime: '2018-02-20T18:02:13Z',
        speedAverage: 4.4,
        cadence: 24,
        distance: 2000,
        calories: 233,
      },
      songs: [
        {
          id: 123,
          audioUrl:
            'https://apiboxfiles.erweima.ai/YmY2YWVlZjYtY2RhYy00MzM0LWIwZjUtNjQ3Zjg4YjUxNTIy.mp3',
          imageUrl:
            'https://apiboxfiles.erweima.ai/YmY2YWVlZjYtY2RhYy00MzM0LWIwZjUtNjQ3Zjg4YjUxNTIy.jpeg',
          title: 'Fire Song',
        },
      ],
    },
    {
      activity: {
        id: 123,
        type: 'ride',
        title: 'Run baby run',
        duration: 100,
        heartrate: 200,
        startTime: '2018-02-20T18:02:13Z',
        speedAverage: 4.4,
        cadence: 24,
        distance: 2000,
        calories: 233,
      },
      songs: [
        {
          id: 123,
          audioUrl:
            'https://apiboxfiles.erweima.ai/YmY2YWVlZjYtY2RhYy00MzM0LWIwZjUtNjQ3Zjg4YjUxNTIy.mp3',
          imageUrl:
            'https://apiboxfiles.erweima.ai/YmY2YWVlZjYtY2RhYy00MzM0LWIwZjUtNjQ3Zjg4YjUxNTIy.jpeg',
          title: 'Fire Song',
        },
      ],
    },
    {
      activity: {
        id: 123,
        type: 'run',
        title: 'Run baby run',
        duration: 100,
        heartrate: 200,
        startTime: '2018-02-20T18:02:13Z',
        speedAverage: 4.4,
        cadence: 24,
        distance: 2000,
        calories: 233,
      },
      songs: [
        {
          id: 123,
          audioUrl:
            'https://apiboxfiles.erweima.ai/YmY2YWVlZjYtY2RhYy00MzM0LWIwZjUtNjQ3Zjg4YjUxNTIy.mp3',
          imageUrl:
            'https://apiboxfiles.erweima.ai/YmY2YWVlZjYtY2RhYy00MzM0LWIwZjUtNjQ3Zjg4YjUxNTIy.jpeg',
          title: 'Fire Song',
        },
      ],
    },
    {
      activity: {
        id: 123,
        type: 'ride',
        title: 'Run baby run',
        duration: 100,
        heartrate: 200,
        startTime: '2018-02-20T18:02:13Z',
        speedAverage: 4.4,
        cadence: 24,
        distance: 2000,
        calories: 233,
      },
      songs: [
        {
          id: 123,
          audioUrl:
            'https://apiboxfiles.erweima.ai/YmY2YWVlZjYtY2RhYy00MzM0LWIwZjUtNjQ3Zjg4YjUxNTIy.mp3',
          imageUrl:
            'https://apiboxfiles.erweima.ai/YmY2YWVlZjYtY2RhYy00MzM0LWIwZjUtNjQ3Zjg4YjUxNTIy.jpeg',
          title: 'Fire Song',
        },
      ],
    },
    {
      activity: {
        id: 123,
        type: 'static',
        title: 'Run baby run',
        duration: 100,
        heartrate: 200,
        startTime: '2018-02-20T18:02:13Z',
        speedAverage: 4.4,
        cadence: 24,
        distance: 2000,
        calories: 233,
      },
      songs: [
        {
          id: 123,
          audioUrl:
            'https://apiboxfiles.erweima.ai/YmY2YWVlZjYtY2RhYy00MzM0LWIwZjUtNjQ3Zjg4YjUxNTIy.mp3',
          imageUrl:
            'https://apiboxfiles.erweima.ai/YmY2YWVlZjYtY2RhYy00MzM0LWIwZjUtNjQ3Zjg4YjUxNTIy.jpeg',
          title: 'Fire Song',
        },
      ],
    },
    {
      activity: {
        id: 123,
        type: 'ride',
        title: 'Run baby run',
        duration: 100,
        heartrate: 200,
        startTime: '2018-02-20T18:02:13Z',
        speedAverage: 4.4,
        cadence: 24,
        distance: 2000,
        calories: 233,
      },
      songs: [
        {
          id: 123,
          audioUrl:
            'https://apiboxfiles.erweima.ai/YmY2YWVlZjYtY2RhYy00MzM0LWIwZjUtNjQ3Zjg4YjUxNTIy.mp3',
          imageUrl:
            'https://apiboxfiles.erweima.ai/YmY2YWVlZjYtY2RhYy00MzM0LWIwZjUtNjQ3Zjg4YjUxNTIy.jpeg',
          title: 'Fire Song',
        },
      ],
    },
    {
      activity: {
        id: 123,
        type: 'ride',
        title: 'Run baby run',
        duration: 100,
        heartrate: 200,
        startTime: '2018-02-20T18:02:13Z',
        speedAverage: 4.4,
        cadence: 24,
        distance: 2000,
        calories: 233,
      },
      songs: [
        {
          id: 123,
          audioUrl:
            'https://apiboxfiles.erweima.ai/YmY2YWVlZjYtY2RhYy00MzM0LWIwZjUtNjQ3Zjg4YjUxNTIy.mp3',
          imageUrl:
            'https://apiboxfiles.erweima.ai/YmY2YWVlZjYtY2RhYy00MzM0LWIwZjUtNjQ3Zjg4YjUxNTIy.jpeg',
          title: 'Fire Song',
        },
      ],
    },
    {
      activity: {
        id: 123,
        type: 'ride',
        title: 'Run baby run',
        duration: 100,
        heartrate: 200,
        startTime: '2018-02-20T18:02:13Z',
        speedAverage: 4.4,
        cadence: 24,
        distance: 2000,
        calories: 233,
      },
      songs: [
        {
          id: 123,
          audioUrl:
            'https://apiboxfiles.erweima.ai/YmY2YWVlZjYtY2RhYy00MzM0LWIwZjUtNjQ3Zjg4YjUxNTIy.mp3',
          imageUrl:
            'https://apiboxfiles.erweima.ai/YmY2YWVlZjYtY2RhYy00MzM0LWIwZjUtNjQ3Zjg4YjUxNTIy.jpeg',
          title: 'Fire Song',
        },
      ],
    },
    {
      activity: {
        id: 124,
        type: 'ride',
        title: 'Run baby run',
        duration: 100,
        heartrate: 200,
        startTime: '2018-02-20T18:02:13Z',
        speedAverage: 4.4,
        cadence: 24,
        distance: 2000,
        calories: 233,
      },
      songs: [],
    },
  ]
})

const reload = async () => {
  await getActivitiesWithSong()
  if (userActivitiesWithSong.value.length > 0) {
    toast.add({
      title: 'Success',
      description: 'Activities with songs loaded',
      color: 'success',
    })
  } else {
    toast.add({
      title: 'Alert',
      description: 'No new songs found',
      color: 'warning',
    })
  }
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
      title: 'Alert',
      description: 'No activities found',
      color: 'warning',
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
        <UButton @click="reload"> Load activities </UButton>
        <UButton @click="getMissingSongs"> Request songs </UButton>
      </div>
    </BottomBar>
  </div>
</template>

<style lang="css" scoped></style>
