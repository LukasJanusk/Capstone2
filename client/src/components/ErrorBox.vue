<script setup lang="ts">
import { error, errorMessage, resetError } from '../errors'
const props = defineProps<{ message?: string }>()
</script>

<template>
  <Transition name="fade">
    <div class="toast-error" v-if="error">
      <h2>
        {{ props.message ? props.message : errorMessage ? errorMessage : 'Unknown Error occured' }}
      </h2>
      <button @click="(resetError, $emit('close'))">Close</button>
    </div>
  </Transition>
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
.toast-error {
  border-radius: 10px;
  padding: 15px;
  border: 3px solid black;
  background-color: rgba(60, 2, 1, 1);
  box-shadow: 6px 6px 10px rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}
</style>
