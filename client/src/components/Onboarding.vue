<script setup lang="ts">
import { ref } from 'vue'
const isOpen = ref(false)
</script>

<template>
  <UModal
    v-model:open="isOpen"
    title="About"
    :close="{
      color: 'primary',
      variant: 'ghost',
      class: 'rounded-full',
    }"
  >
    <UButton
      label="About"
      icon="i-lucide-circle-help"
      class="mt-2"
      size="sm"
      color="neutral"
      variant="soft"
      @click="isOpen = true"
    />
    <template #content>
      <AboutCards @close="isOpen = false"></AboutCards>
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
