<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'

defineProps({ name: String })
const opacity = ref(1)
const updateOpacity = () => {
  const scrollY = window.scrollY
  if (scrollY >= 30) {
    opacity.value = 0
  } else {
    opacity.value = 1 - scrollY / 100
  }
}
onMounted(() => {
  window.addEventListener('scroll', updateOpacity)
})
onUnmounted(() => {
  window.removeEventListener('scroll', updateOpacity)
})
</script>
<template>
  <div class="top-bar">
    <h2 :style="{ opacity: opacity }">{{ name ? name : 'Home' }}</h2>
  </div>
</template>
<style lang="css" scoped>
.top-bar {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(1, 1, 1, 0));
  position: fixed;
  height: 200px;
  width: 100%;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>
