<script lang="ts" setup>
import router from './router'
interface Props {
  title: string
  userName: string
  message: string
}

const { title, userName, message } = defineProps<Props>()
</script>

<template>
  <UCard>
    <template #header>
      <div class="h-8">{{ title }}</div>
    </template>

    <div class="h-32">
      <span>{{ userName }}</span
      ><span>, </span><span>{{ message }}</span>
    </div>
    <template #footer>
      <div class="h-8">
        <UButton @click="router.push({ name: 'Dashboard' })">To Dashboard</UButton>
      </div>
    </template>
  </UCard>
</template>
