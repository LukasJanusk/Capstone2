<script setup lang="ts">
const props = defineProps<{ message: string }>()
const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div class="toast-error">
    <h2>{{ props.message }}</h2>
    <button @click="emit('close')">Close</button>
  </div>
</template>

<style lang="css" scoped>
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
