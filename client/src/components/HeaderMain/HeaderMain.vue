<script setup lang="ts">
import HeaderMaximized from './HeaderMaximized.vue'
import HeaderMinimized from './HeaderMinimized.vue'
import { showHeader } from '@/user'

const toggle = () => (showHeader.value = !showHeader.value)
</script>

<template>
  <Transition name="slide">
    <component
      :is="showHeader ? HeaderMaximized : HeaderMinimized"
      @toggle="toggle"
      @signup="$emit('signup')"
      @signin="$emit('signin')"
      @signout="$emit('signout')"
      @dashboard="$emit('dashboard')"
    />
  </Transition>
</template>

<style lang="css" scoped>
.slide-enter-active {
  transition: all 0.3s ease-out;
  transition-delay: 0.2s;
}

.slide-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-130px);
  opacity: 100;
}
</style>
