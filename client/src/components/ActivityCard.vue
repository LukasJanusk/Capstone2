<script setup lang="ts">
const props = defineProps<{ title: string; date: string; image: string; alt: string }>()
</script>
<template>
  <UCard variant="subtle" class="w-full md:w-[320px] min-w-72 min-h-56">
    <template #header>
      <span class="h-8 text-xl font-bold">{{ props.title }}</span>
    </template>

    <img :src="props.image" alt="workout logo image" />

    <template #footer>
      <span class="h-4">{{ props.date }}</span>
    </template>
  </UCard>
</template>
