<script setup lang="ts">
import { cards } from '@/utils/cards'
import { onMounted, onUnmounted, ref } from 'vue'
import router from '@/router'
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
const index = ref(0)
</script>
<template>
  <div>
    <MainContainer>
      <UCarousel
        v-slot="{ item, index: currentIndex }"
        dots
        :arrows="!isSmall"
        :items="cards"
        :index="index"
        @update:index="index = $event"
        class="h-full flex items-center justify-center px-10 md:px-4 w-100"
      >
        <div
          class="flex flex-col items-center justify-center text-center text-2xl md:text-4xl px-6 py-10 min-h-[300px] w-full max-w-lg"
        >
          <p class="mb-4">{{ item }}</p>
          <UButton
            size="xl"
            variant="subtle"
            v-if="currentIndex === cards.length - 1"
            @click="router.push({ name: 'Home' })"
          >
            Home
          </UButton>
        </div>
      </UCarousel>
    </MainContainer>
  </div>
</template>
