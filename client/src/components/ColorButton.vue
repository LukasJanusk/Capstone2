<script setup>
import { useColorMode } from '@vueuse/core'

const mode = useColorMode()
</script>

<template>
  <UButton
    :icon="mode === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'"
    size="sm"
    color="neutral"
    variant="soft"
    @click="mode = mode === 'dark' ? 'light' : 'dark'"
  />
</template>
