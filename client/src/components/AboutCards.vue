<script setup lang="ts">
import { setOnboardComplete } from '@/user'
import { onMounted, onUnmounted, ref } from 'vue'
import { cards } from '@/utils/cards'

const isSmall = ref(window.innerWidth < 768)
function onResize() {
  isSmall.value = window.innerWidth < 768
}
onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})
onMounted(() => {
  index.value = 0
  window.addEventListener('resize', onResize)
})

const isOpen = ref(false)
const index = ref(0)
const emit = defineEmits<{ close: [] }>()

const finishOnboarding = () => {
  setOnboardComplete()
  isOpen.value = false
  emit('close')
}
</script>
<template>
  <UCarousel
    v-slot="{ item, index: currentIndex }"
    :dots="isSmall"
    :arrows="!isSmall"
    :items="cards"
    :index="index"
    @update:index="index = $event"
  >
    <div
      class="flex flex-col items-center justify-center text-center text-2xl md:text-4xl px-6 py-10 min-h-[300px] w-full max-w-lg"
    >
      <p class="mb-4">{{ item }}</p>
      <UButton
        size="xl"
        variant="subtle"
        v-if="currentIndex === cards.length - 1"
        @click="finishOnboarding"
      >
        Got it!
      </UButton>
    </div>
  </UCarousel>
</template>
