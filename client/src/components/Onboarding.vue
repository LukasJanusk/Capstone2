<script setup lang="ts">
import { setOnboardComplete } from '@/user'
import { onMounted, ref } from 'vue'

const cards = [
  'This app use your workout data and personality traits to generate music',
  'During the signup you will be asekd to select at least 3 traits that best define you',
  'Once signed up you will have to grant this app access to your strava account',
  'After Strava authorization your workouts will automatically start generating songs once they are complete',
  'To listen to generated songs navigate to the Dashboard and click on a workout',
  'Good luck and enjoy!',
]
const index = ref(0)
const emit = defineEmits<{ close: [boolean] }>()
onMounted(() => {
  index.value = 0
})
const finishOnboarding = () => {
  setOnboardComplete()
  emit('close', true)
}
</script>

<template>
  <UModal
    title="Modal with close button"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }"
  >
    <UButton label="Start Onboarding" color="primary" variant="subtle" />
    <template #content>
      <UCarousel
        v-slot="{ item, index: currentIndex }"
        arrows
        :items="cards"
        :index="index"
        @update:index="index = $event"
      >
        <div class="onboarding-card">{{ item }}</div>
        <UButton
          size="xl"
          v-if="currentIndex === cards.length - 1"
          @click="finishOnboarding"
          class="mt-4"
        >
          Got it!
        </UButton>
      </UCarousel>
    </template>
  </UModal>
</template>

<style lang="css" scoped>
.button-box {
  display: flex;
  justify-content: space-around;
}
.onboarding-card {
  padding: 20px;
}
</style>
